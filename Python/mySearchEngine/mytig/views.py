import logging
import requests

from django.http import Http404
from django.http import JsonResponse

from rest_framework.views import APIView
from rest_framework.response import Response

from mytig.config import baseUrl
from mytig.models import ProduitEnPromotion, ProduitDisponible, Poisson, Crustacean, Coquillage
from mytig.serializers import (ProduitEnPromotionSerializer, AvailableProductSerializer,
                               PoissonsSerializer, CrustaceansSerializer,
                               CoquillagesSerializer)


# Create your views here.
class RedirectionListeDeProduits(APIView):
    def get(self, request, format=None):
        response = requests.get(baseUrl+'products/')
        jsondata = response.json()
        return Response(jsondata)
#    def post(self, request, format=None):
#        NO DEFITION of post --> server will return "405 NOT ALLOWED"


class RedirectionDetailProduit(APIView):
    def get(self, request, pk, format=None):
        try:
            response = requests.get(baseUrl+'product/'+str(pk)+'/')
            jsondata = response.json()
            return Response(jsondata)
        except:
            raise Http404
#    def put(self, request, pk, format=None):
#        NO DEFITION of put --> server will return "405 NOT ALLOWED"
#    def delete(self, request, pk, format=None):
#        NO DEFITION of delete --> server will return "405 NOT ALLOWED"



class PromoList(APIView):
    def get(self, request, format=None):
        res = []
        for prod in ProduitEnPromotion.objects.all():
            serializer = ProduitEnPromotionSerializer(prod)
            response = requests.get(baseUrl+'product/'+str(serializer.data['tigID'])+'/')
            jsondata = response.json()
            res.append(jsondata)
        return JsonResponse(res, safe=False)
#    def post(self, request, format=None):
#        NO DEFINITION of post --> server will return "405 NOT ALLOWED"


class PromoDetail(APIView):
    def get_object(self, pk):
        try:
            return ProduitEnPromotion.objects.get(pk=pk)
        except ProduitEnPromotion.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        prod = self.get_object(pk)
        serializer = ProduitEnPromotionSerializer(prod)
        response = requests.get(baseUrl+'product/'+str(serializer.data['tigID'])+'/')
        jsondata = response.json()
        return Response(jsondata)
#    def put(self, request, pk, format=None):
#        NO DEFITION of put --> server will return "405 NOT ALLOWED"
#    def delete(self, request, pk, format=None):
#        NO DEFITION of delete --> server will return "405 NOT ALLOWED"


class ShipPointsList(APIView):
    def get(self, request, format=None):
        response = requests.get(baseUrl + 'shipPoints/')
        jsondata = response.json()
        return Response(jsondata)

#    def post(self, request, format=None):
#        NO DEFITION of post --> server will return "405 NOT ALLOWED"


class RedirectionShipPointDetail(APIView):
    def get(self, request, pk, format=None):
        try:
            response = requests.get(f"{baseUrl}shipPoint/{pk}/")
            jsondata = response.json()
            return Response(jsondata)
        except:
            raise Http404

#    def put(self, request, pk, format=None):
#        NO DEFITION of put --> server will return "405 NOT ALLOWED"
#    def delete(self, request, pk, format=None):
#        NO DEFITION of delete --> server will return "405 NOT ALLOWED"


class AvailableProducts(APIView):
    def get(self, request, format=None):
        res = []
        for prod in ProduitDisponible.objects.all():
            serializer = AvailableProductSerializer(prod)
            response = requests.get(baseUrl+'product/'+str(serializer.data['tigID'])+'/')
            jsondata = response.json()
            res.append(jsondata)
        return JsonResponse(res, safe=False)

    # def get(self, request, format=None):
    #     response = requests.get(baseUrl + 'products/')
    #     jsondata = response.json()
    #
    #     available = []
    #     logger = logging.getLogger("mylogger")
    #     for item in jsondata:
    #         logger.info(item)
    #         if "availability" in item and item["availability"]:
    #             available.append(item)
    #
    #     return Response(available)


class AvailableProductDetail(APIView):
    def get_object(self, pk):
        try:
            return ProduitDisponible.objects.get(pk=pk)
        except ProduitDisponible.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        prod = self.get_object(pk)
        serializer = AvailableProductSerializer(prod)
        response = requests.get(baseUrl+'product/'+str(serializer.data['tigID'])+'/')
        jsondata = response.json()
        return Response(jsondata)

    #    def post(self, request, format=None):
    #        NO DEFINITION of post --> server will return "405 NOT ALLOWED"


class PoissonsListe(APIView):
    def get(self, request, format=None):
        res = []
        for prod in Poisson.objects.all():
            serializer = PoissonsSerializer(prod)
            response = requests.get(baseUrl+'product/'+str(serializer.data['tigID'])+'/')
            jsondata = response.json()
            res.append(jsondata)
        return JsonResponse(res, safe=False)


class PoissonDetail(APIView):
    def get_object(self, pk):
        try:
            return Poisson.objects.get(pk=pk)
        except Poisson.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        prod = self.get_object(pk)
        serializer = PoissonsSerializer(prod)
        response = requests.get(baseUrl+'product/'+str(serializer.data['tigID'])+'/')
        jsondata = response.json()
        return Response(jsondata)

    #    def post(self, request, format=None):
    #        NO DEFINITION of post --> server will return "405 NOT ALLOWED"


class CrustaceanListe(APIView):
    def get(self, request, format=None):
        res = []
        for prod in Crustacean.objects.all():
            serializer = CrustaceansSerializer(prod)
            response = requests.get(baseUrl+'product/'+str(serializer.data['tigID'])+'/')
            jsondata = response.json()
            res.append(jsondata)
        return JsonResponse(res, safe=False)


class CrustaceanDetail(APIView):
    def get_object(self, pk):
        try:
            return Crustacean.objects.get(pk=pk)
        except Crustacean.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        prod = self.get_object(pk)
        serializer = CrustaceansSerializer(prod)
        response = requests.get(baseUrl+'product/'+str(serializer.data['tigID'])+'/')
        jsondata = response.json()
        return Response(jsondata)

    #    def post(self, request, format=None):
    #        NO DEFINITION of post --> server will return "405 NOT ALLOWED"


class CoquillageListe(APIView):
    def get(self, request, format=None):
        res = []
        for prod in Coquillage.objects.all():
            serializer = CoquillagesSerializer(prod)
            response = requests.get(baseUrl+'product/'+str(serializer.data['tigID'])+'/')
            jsondata = response.json()
            res.append(jsondata)
        return JsonResponse(res, safe=False)


class CoquillageDetail(APIView):
    def get_object(self, pk):
        try:
            return Coquillage.objects.get(pk=pk)
        except Coquillage.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        prod = self.get_object(pk)
        serializer = CoquillagesSerializer(prod)
        response = requests.get(baseUrl+'product/'+str(serializer.data['tigID'])+'/')
        jsondata = response.json()
        return Response(jsondata)

    #    def post(self, request, format=None):
    #        NO DEFINITION of post --> server will return "405 NOT ALLOWED"