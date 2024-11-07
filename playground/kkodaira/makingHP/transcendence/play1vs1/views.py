from django.shortcuts import render

# Create your views here.
def play1vs1(request):
	return render(request, "play1vs1/play1vs1.html")