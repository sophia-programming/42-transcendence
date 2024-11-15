import math

class Utils:
	def normalize_angle(angle):
		return angle % (2 * math.pi)

	def set_direction(ball):
		if (math.pi <= ball.angle and ball.angle <= math.pi * 2):
			ball.direction["facing_up"] = True
			ball.direction["facing_down"] = False
		else:
			ball.direction["facing_up"] = False
			ball.direction["facing_down"] = True
		if ((math.pi / 2) <= ball.angle and ball.angle <= (math.pi * 3 / 2)):
			ball.direction["facing_left"] = True
			ball.direction["facing_right"] = False
		else:
			ball.direction["facing_left"] = False
			ball.direction["facing_right"] = True