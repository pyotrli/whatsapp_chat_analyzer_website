import regex
import emoji
import datetime
from time import strftime
import json
from string import punctuation
from collections import Counter

import analyze_text

# set english stop words
stop_words = open("stop_words_EN.txt", "r").read().split()

unicode_grapheme_ptrn = regex.compile('\X')
def extract_emoji_and_words(text):
    emoji_list = []
    words = ""
    data = unicode_grapheme_ptrn.findall(text)
    # '\X' (Unicode extended grapheme cluster) matches any valid Unicode sequence, including line breaks
    # emojis can be a set of unicode chars which represent one sequence (and hence one emoji)
    # also accounts for other special chars like
    for grapheme in data:
        if any(char in emoji.UNICODE_EMOJI for char in grapheme):
            emoji_list.append(grapheme)
        else:
            words += grapheme

    return {"emoji_list": emoji_list, "words": words}

def extract_datetime(msg):
    year = int(msg.group('year'))
    month = int(msg.group('month'))
    day = int(msg.group('day'))
    hour = int(msg.group('hour'))
    minute = int(msg.group('minute'))
    dt = datetime.datetime(year, month, day, hour, minute)
    dt = dt.timetuple()
    return dt

class Person_stats:
    def __init__(self, name):
        self.name = name
        self.total_msgs = 0
        self.msg_per_date = {} # {"YYYMMDD": int, ....}
        self.msg_per_weekday = [0 for i in range(7)] # [M, T, W, T, F, S, S]
        self.msg_per_hour = [0 for i in range(24)] # [0, 0, ..., 0]
        self.top_10_words = [] # ordered list of top 10 words [("hello", 10), ("bye", 9),...]
        self.top_10_emojis = [] # list of top 10 emojis
        self.all_words = "" # string of all words used
        self.all_emojis = [] # list of all emojis used
        self.total_words = 0 # total words used
        self.total_emojis = 0 # total emojis used
        self.full_text = "" # all msgs
        self.sentiment = {} # {"score": sentiment.score, "magnitude": sentiment.magnitude}

    # update total_msgs, msg_per_date, msg_per_weekday, msg_per_hour
    def update_count_stats(self, msg):
        self.total_msgs += 1
        dt = extract_datetime(msg)
        date = strftime("%Y%m%d", dt)
        if not date in self.msg_per_date:
            self.msg_per_date[date] = 1
        else:
            self.msg_per_date[date] += 1

        self.msg_per_hour[dt.tm_hour] += 1
        self.msg_per_weekday[dt.tm_wday] += 1

    # update all_words and all_emojis
    def update_all_words_all_emojis(self, msg):
        if type(msg) == type(" "):
            result = msg
        else:
            result = msg.group('message')
        result = extract_emoji_and_words(result)
        emojis = result["emoji_list"]
        if len(emojis) > 0:
            self.all_emojis.extend(emojis)

        words = result["words"]
        if len(words) > 0:
            self.all_words = self.all_words + " " + words

    # update full_text for sentiment analysis
    def update_full_text(self, msg):
        if type(msg) == type(" "):
            if len(msg) > 0:
                self.full_text = self.full_text + " " + msg
        else:
            new_msg = msg.group('message')
            self.full_text = self.full_text + " " + new_msg

    def update_top_10_counts(self):
        # update top_10_words
        text = self.all_words.lower().split()
        noStopWords = []
        for word in text:
            # remove punctuation
            word = word.rstrip(punctuation)
            if not word:
                continue
            if not word in stop_words:
                noStopWords.append(word)
        c = Counter(noStopWords)
        self.top_10_words = c.most_common(10)

         # update top_10_emojis
        c = Counter(self.all_emojis)
        self.top_10_emojis = c.most_common(10)

    # update total_words and total_emojis count
    def update_total_words_total_emojis(self):
        self.total_words = len(self.all_words.split())
        self.total_emojis = len(self.all_emojis)

    # Delete all_words and all_emojis for privacy
    def delete_all_words_all_emojis_full_text(self):
        self.all_words = ""
        self.all_emojis = ""
        self.full_text = {}

    # update sentiment
    def update_sentiment(self):
        try:
            self.sentiment = analyze_text.analyze_sentiment(self.full_text)
        except:
            print('sentiment analysis failed')



# Parse message and filter out system and media messages
msg_start_ptrn = regex.compile('(?P<day>\d{2})/(?P<month>\d{2})/(?P<year>\d{4}),\s(?P<hour>\d{2}):(?P<minute>\d{2})\s-\s(?P<sender>.*?):(?P<message>.*)')
sys_notif_ptrn = regex.compile('(?P<day>\d{2})/(?P<month>\d{2})/(?P<year>\d{4}),\s(?P<hour>\d{2}):(?P<minute>\d{2})\s-\s')
def parse_msg(message):
    # check if msg starts with date and time pattern and includes ":" after the sender name / number
    new_msg = msg_start_ptrn.match(message)
    if new_msg:
        if "omitted" in new_msg.group('message'):
            return "media_msg"
        else:
            return new_msg
    # check if msg starts with date and time. If no ":" present after sender name, must be a sys msg.
    sys_notif = sys_notif_ptrn.match(message)
    if sys_notif:
        return "sys_notif"
    # if msg doesn't start with date time pattern, must be continuation of previous msg
    else:
        return "old_msg"

# main function to parse the file and return all stats
def parse_android(file):
    file = file.decode('UTF-8').splitlines()
    # results is a list of Person_stats objects
    results = []
    name = None
    for line in file:
        # found = has this user been seen already?
        found = False
        if not line:
            continue
        else:
            try:
                msg = parse_msg(line)
                if msg == 'media_msg':
                    continue
                elif msg == 'sys_notif':
                    continue
                # if a new line of old message, parse_msg returns "old_msg" txt
                elif msg == 'old_msg':
                    for person in results:
                        if person.name == name:
                            person.update_all_words_all_emojis(line)
                            person.update_full_text(line)
                            break
                elif msg:
                    name = msg.group('sender')
                    for person in results:
                        if person.name == name:
                            person.update_count_stats(msg)
                            person.update_all_words_all_emojis(msg)
                            person.update_full_text(msg)
                            found = True
                            break
                    if not found:
                        new_person = Person_stats(name)
                        new_person.update_count_stats(msg)
                        new_person.update_all_words_all_emojis(msg)
                        new_person.update_full_text(msg)
                        results.append(new_person)
                pass
            except:
                continue

    # order persons by total_msgs desc
    results.sort(key=lambda x: x.total_msgs, reverse=True)


    # update top 10 counts and convert output to JSON for javascript

    json_results = []
    for person in results:
        person.update_top_10_counts()
        person.update_total_words_total_emojis()
        person.update_sentiment()
        # delete all words and all emojis for security
        person.delete_all_words_all_emojis_full_text()
        json_results.append(json.dumps(person.__dict__))

    if len(json_results) == 0:
        return None
    else:
        # generate demo json.txt
        #with open('demo_chat_json.txt', 'w') as outfile:
            #json.dump(json_results, outfile)
        json_results = json.dumps(json_results)

    return json_results
