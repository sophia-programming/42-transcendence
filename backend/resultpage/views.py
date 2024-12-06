from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from django.views import View


class indexView(View):
    def get(self, request):
        return render(request, "resultpage/index.html")


def winner_view(request, username):
    context = {
        'username': username
    }
    return render(request, 'resultpage/winner.html', context)

index = indexView.as_view()