from django.shortcuts import render


def matches_view(request):
    if request.method == "POST":
        players = {
            "player1": request.POST.get("player1"),
            "player2": request.POST.get("player2"),
            "player3": request.POST.get("player3"),
            "player4": request.POST.get("player4"),
            "player5": request.POST.get("player5"),
            "player6": request.POST.get("player6"),
            "player7": request.POST.get("player7"),
            "player8": request.POST.get("player8"),
        }
        return render(request, "matches/matches.html", {"players": players})
    else:
        # GETリクエストの場合の処理（必要に応じて）
        return render(request, "matches/matches.html")
