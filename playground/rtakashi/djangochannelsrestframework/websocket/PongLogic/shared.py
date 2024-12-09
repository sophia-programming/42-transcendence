import math


class Singleton:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super().__new__(cls, *args, **kwargs)
        return cls._instance


class game_window(Singleton):
    def __init__(self):
        if not hasattr(self, "initialized"):
            self.width = 1000
            self.height = 600
            self.initialized = True


class ball(Singleton):
    def __init__(self):
        if not hasattr(self, "initialized"):
            self.radius = 10
            self.x = 500
            self.y = 300
            self.angle = 0
            self.velocity = 5
            self.direction = {
                "facing_up": False,
                "facing_down": False,
                "facing_right": False,
                "facing_left": False,
            }
            self.bound_angle = {
                "left_top": math.pi * 7 / 4,
                "left_bottom": math.pi / 4,
                "right_top": math.pi * 5 / 4,
                "right_bottom": math.pi * 3 / 4,
            }
            self.initialized = True


class paddle(Singleton):
    def __init__(self):
        if not hasattr(self, "initialized"):
            self.width = 15
            self.height = 120
            self.left_y = 240
            self.right_y = 240
            self.initialized = True
