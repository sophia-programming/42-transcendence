from django.shortcuts import render


# Create your views here.
def matches_view(request):
    return render(request, "matches/matches.html")
