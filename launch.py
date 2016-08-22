import webapp2

def App(path, type):
    class MyApp(webapp2.RequestHandler):
        def get(self):
            self.response.headers["Content-Type"] = type
            with open(path, "r") as r:
                data = r.read()
            self.response.write(data)
    return MyApp

app = webapp2.WSGIApplication([
    ('/', App("fll_practice.html", "text/html")),
    ('/fll_practice.js', App("fll_practice.js", "application/javascript")),
    ('/fll_practice.css', App("fll_practice.css", "text/css")),
    ('/teams.js', App("teams.js", "application/javascript")),
], debug=True)

def main():
    from paste import httpserver
    httpserver.serve(app, host='10.60.175.138', port='8080')

if __name__ == '__main__':
    main()

