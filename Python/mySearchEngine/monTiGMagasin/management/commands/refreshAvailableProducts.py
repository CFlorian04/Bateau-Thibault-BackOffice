import logging

from django.core.management.base import BaseCommand, CommandError
from monTiGMagasin.models import ProduitDisponible
from monTiGMagasin.serializers import AvailableProductSerializer
from monTiGMagasin.config import baseUrl
import requests
import time


class Command(BaseCommand):
    help = 'Refresh the list of products which are on sale.'

    def handle(self, *args, **options):
        self.stdout.write('['+time.ctime()+'] Refreshing data...')
        response = requests.get(baseUrl+'products/')
        jsondata = response.json()
        ProduitDisponible.objects.all().delete()
        for product in jsondata:
            if product['availability']:
                serializer = AvailableProductSerializer(data={'tigID':str(product['id'])})
                if serializer.is_valid():
                    serializer.save()
                    self.stdout.write(self.style.SUCCESS('[' + time.ctime() +'] Successfully added product id="%s"' % product['id']))
        self.stdout.write('['+time.ctime()+'] Data refresh terminated.')
