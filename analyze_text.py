# https://cloud.google.com/natural-language/docs/reference/libraries
# Imports the Google Cloud client library
from google.cloud import language
from google.cloud.language import enums
from google.cloud.language import types
from google.api_core import exceptions

# Instantiates a client
client = language.LanguageServiceClient()

# Google NLP API limits: https://cloud.google.com/natural-language/quotas
# api_limit max 1 000 000
api_limit = 1000

def analyze_sentiment(text):
    # trim txt to API limit
    text = text.encode('utf-8')
    # take latest text to limit in bytes
    text = text[-api_limit:]
    text = text.decode('utf-8')

    document = types.Document(
        content=text,
        type=enums.Document.Type.PLAIN_TEXT)

    # Detects the sentiment of the text
    try:
        sentiment = client.analyze_sentiment(document=document).document_sentiment

        return{
        "score": sentiment.score,
        "magnitude": sentiment.magnitude
        }

        pass

    except:
        return {
        "score": 0,
        "magnitude": 0
        }
