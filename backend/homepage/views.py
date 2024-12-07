from django.contrib.auth.decorators import login_required
from django.shortcuts import render


@login_required
def homepage_view(request):
    return render(request, "homepage/homepage.html")
