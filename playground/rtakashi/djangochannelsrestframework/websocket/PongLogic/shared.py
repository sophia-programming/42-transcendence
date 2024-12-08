import math


class Singleton:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super().__new__(cls, *args, **kwargs)
        return cls._instance


class game_window(Singleton):
    width = 1000
    height = 600


class ball(Singleton):
    radius = 10
    x = 500
    y = 300
    angle = 0
    velocity = 5
    direction = {
        "facing_up": False,
        "facing_down": False,
        "facing_right": False,
        "facing_left": False,
    }
    bound_angle = {
        "left_top": math.pi * 7 / 4,
        "left_bottom": math.pi / 4,
        "right_top": math.pi * 5 / 4,
        "right_bottom": math.pi * 3 / 4,
    }


class paddle(Singleton):
    width = 15
    height = 120
    left_y = 240
    right_y = 240
