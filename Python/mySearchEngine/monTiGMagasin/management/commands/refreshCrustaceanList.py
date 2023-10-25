from django.core.management.base import BaseCommand, CommandError
from monTiGMagasin.models import Crustacean
from monTiGMagasin.serializers import CrustaceansSerializer
from monTiGMagasin.config import baseUrl
import requests
import time


class Command(BaseCommand):
    help = 'Refresh the list of products which are on sale.'

    def handle(self, *args, **options):
        self.stdout.write('['+time.ctime()+'] Refreshing data...')
        response = requests.get(baseUrl+'products/')
        jsondata = response.json()
        Crustacean.objects.all().delete()
        for product in jsondata:
            if product['category'] == 2:
                serializer = CrustaceansSerializer(data={'tigID':str(product['id'])})
                if serializer.is_valid():
                    serializer.save()
                    self.stdout.write(self.style.SUCCESS(f"[{time.ctime()}] Successfully added product id={product['id']}, cat={product['category']}, name={product['name']}"))
        self.stdout.write('['+time.ctime()+'] Data refresh terminated.')
