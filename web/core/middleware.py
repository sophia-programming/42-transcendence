from oauth.views import oauth_view


def oauth_middleware(get_response):
    def middleware(request):
        if not request.path.startswith("/admin/"):
            response = oauth_view(request)
            if response.status_code != 200:
                return response
        return get_response(request)

    return middleware
