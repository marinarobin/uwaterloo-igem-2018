from google.appengine.ext import ndb


class Result(ndb.Model):
    date = ndb.DateTimeProperty(auto_now_add=True)
    text = ndb.StringProperty(indexed=False)

    @classmethod
    def new(cls, text):
        result = Result(
            text=text
        )
        return result.put()

