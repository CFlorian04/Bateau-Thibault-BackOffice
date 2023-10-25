import requests
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import Http404, JsonResponse
from monTiGMagasin.config import baseUrl
from monTiGMagasin.models import InfoProduct, ProduitEnPromotion, ProduitDisponible, Poisson, Crustacean, Coquillage
from monTiGMagasin.serializers import (InfoProductSerializer, ProduitEnPromotionSerializer, AvailableProductSerializer,
                               PoissonsSerializer, CrustaceansSerializer,
                               CoquillagesSerializer)

from rest_framework import status

# Create your views here.
class InfoProductList(APIView):
    def get(self, request, format=None):
        products = InfoProduct.objects.all()
        serializer = InfoProductSerializer(products, many=True)
        return Response(serializer.data)
class InfoProductDetail(APIView):
    def get_object(self, tig_id):
        try:
            return InfoProduct.objects.get(tig_id=tig_id)
        except InfoProduct.DoesNotExist:
            raise Http404
    def get(self, request, tig_id, format=None):
        product = self.get_object(tig_id=tig_id)
        serializer = InfoProductSerializer(product)
        return Response(serializer.data)


# Doc: FROM OLD FILES
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


@api_view(['GET'])
def put_on_sale(request, id, newprice):
    try:
        product = InfoProduct.objects.get(tig_id=id)
    except InfoProduct.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # Convertir newprice en float
    newprice = float(newprice)

    product.sale = True
    product.discount = newprice
    product.save()

    serializer = InfoProductSerializer(product)
    return Response(serializer.data)


@api_view(['GET'])
def remove_sale(request, id):
    try:
        product = InfoProduct.objects.get(tig_id=id)
    except InfoProduct.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    product.sale = False
    product.discount = 0  # Réinitialisez le champ discount comme vous le souhaitez
    product.save()

    serializer = InfoProductSerializer(product)
    return Response(serializer.data)


@api_view(['GET'])
def increment_stock(request, id, number):
    try:
        product = InfoProduct.objects.get(tig_id=id)
    except InfoProduct.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # Incrémentez la quantité en stock
    product.quantityInStock += number
    product.save()

    if 64 > product.quantityInStock >= 16:
        product.sale = True
        product.discount = 80
        product.save()

    elif product.quantityInStock > 64:
        product.sale = True
        product.discount = 50
        product.save()

    serializer = InfoProductSerializer(product)
    return Response(serializer.data)


@api_view(['GET'])
def decrement_stock(request, id, number):
    try:
        product = InfoProduct.objects.get(tig_id=id)
    except InfoProduct.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # Vérifiez que la quantité en stock est suffisante pour décrémenter
    if product.quantityInStock >= number:
        # Décrémentez la quantité en stock
        product.quantityInStock -= number

        if 64 > product.quantityInStock >= 16:
            product.sale = True
            product.discount = 80

        elif product.quantityInStock > 64:
            product.sale = True
            product.discount = 50

        else:
            product.sale = False
            product.discount = 0

        product.save()

        serializer = InfoProductSerializer(product)
        return Response(serializer.data)
    else:
        return Response({"detail": "Not enough stock to decrement."}, status=status.HTTP_400_BAD_REQUEST)


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