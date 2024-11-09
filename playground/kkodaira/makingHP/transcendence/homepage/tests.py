from django.test import TestCase

# Create your tests here.
from django.urls import reverse

class HomepageViewTests(TestCase):
	def test_homepage_view(self):
		response = self.client.get(reverse('homepage'))
		self.assertEqual(response.status_code, 200)
		self.assertTemplateUsed(response, 'homepage/homepage.html')