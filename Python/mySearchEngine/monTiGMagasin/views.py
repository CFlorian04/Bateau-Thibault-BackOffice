import json
import logging
import datetime
import requests

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import Http404, JsonResponse
from monTiGMagasin.config import baseUrl
from monTiGMagasin.models import InfoProduct, ProduitEnPromotion, ProduitDisponible, Poisson, Crustacean, Coquillage, Historique
from monTiGMagasin.serializers import (InfoProductSerializer, ProduitEnPromotionSerializer, AvailableProductSerializer,
                               PoissonsSerializer, CrustaceansSerializer,
                               CoquillagesSerializer, HistoriqueSerializer)

from rest_framework import status


# Create your views here.
@permission_classes([IsAuthenticated])
class InfoProductList(APIView):
    def get(self, request, format=None):
        products = InfoProduct.objects.all()
        serializer = InfoProductSerializer(products, many=True)
        return Response(serializer.data)


@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
class RedirectionListeDeProduits(APIView):
    def get(self, request, format=None):
        response = requests.get(baseUrl+'products/')
        jsondata = response.json()
        return Response(jsondata)
#    def post(self, request, format=None):
#        NO DEFITION of post --> server will return "405 NOT ALLOWED"


@permission_classes([IsAuthenticated])
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


@permission_classes([IsAuthenticated])
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


@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
def remove_sale(request, pid):
    try:
        product = InfoProduct.objects.get(tig_id=pid)
    except InfoProduct.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    product.sale = False
    product.discount = 0  # Réinitialisez le champ discount comme vous le souhaitez
    product.save()

    serializer = InfoProductSerializer(product)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def increment_stock(request, pid, number):
    try:
        product = InfoProduct.objects.get(tig_id=pid)
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
@permission_classes([IsAuthenticated])
def decrement_stock(request, pid, number):
    try:
        product = InfoProduct.objects.get(tig_id=pid)
    except InfoProduct.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # Vérifiez que la quantité en stock est suffisante pour décrémenter
    if product.quantityInStock >= number:
        # Décrémentez la quantité en stock
        product.quantityInStock -= number

        # Todo: vérifier
        if 64 > product.quantityInStock >= 16:
            product.sale = True
            # Je crois que c'est plutôt 80% du prix soit 20% de réduction
            product.discount = 80

            # 50% du prix soit 50% de réduction
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ajouterHistorique(request, data):
    logging.getLogger("mylogger").info(data)
    data = json.loads(data)
    try:
        change = data['stock_change']
        if change == 0:
            raise ValueError("La quantité de stock changée ne peut pas être égale à 0.")

        new_historique = HistoriqueSerializer(data={
            'tigID': data['id'],
            'stock_change': change,
            'price': data['price'],
            # 'created': datetime.datetime.now().strftime()
        })

        if new_historique.is_valid():
            new_historique.save()

    except KeyError as k:
        logging.getLogger("mylogger").info(f"Une des attendues n'a pas été fournie avec le JSON: {k}")
        return Response({"Impossible d'enregistrer la modification, car au moins une donnée est manquante"})

    except Exception as e:
        logging.getLogger("mylogger").info(f"Une erreur est survenue: {e}")
        return Response({"Impossible d'enregistrer la modification car une erreur est survenue"})

    return Response({"Données ajoutées à l'historique!"})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def afficherHistorique(request):
    logger = logging.getLogger("mylogger")
    res = []

    for prod in Historique.objects.all():
        serializer = HistoriqueSerializer(prod)
        res.append(serializer.data)

    if not res:
        logger.info("RIEN FDP")
        
    return JsonResponse(res, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def afficherHistoriqueObjet(request, pid):
    res = []
    for prod in Historique.objects.all():
        if prod.tigID == pid:
            serializer = HistoriqueSerializer(prod)
            res.append(serializer.data)

    return JsonResponse(res, safe=False)


# Todo: terminer le traitement via POST DATA
@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def modifierObjet(request):
    # data = json.loads(data)

    logging.getLogger("mylogger").info(request.GET.get("body") )
    logging.getLogger("mylogger").info(request.data)
    breakpoint()
    try:
        product = InfoProduct.objects.get(tig_id=data['id'])
        product.quantityInStock = data['quantityInStock']
        product.price = data['price']
        product.save()

    except KeyError as k:
        logging.getLogger("mylogger").info(f"Une des attendues n'a pas été fournie avec le JSON: {k}")
        return Response({"Impossible d'enregistrer la modification, car au moins une donnée est manquante"})

    except Exception as e:
        logging.getLogger("mylogger").info(f"Une erreur est survenue: {e}")
        return Response({"Impossible d'enregistrer la modification car une erreur est survenue"})

    return Response({"Objet modifié avec succès"})


@permission_classes([IsAuthenticated])
class ShipPointsList(APIView):
    def get(self, request, format=None):
        response = requests.get(baseUrl + 'shipPoints/')
        jsondata = response.json()
        return Response(jsondata)


@permission_classes([IsAuthenticated])
class RedirectionShipPointDetail(APIView):
    def get(self, request, pk, format=None):
        try:
            response = requests.get(f"{baseUrl}shipPoint/{pk}/")
            jsondata = response.json()
            return Response(jsondata)
        except:
            raise Http404


@permission_classes([IsAuthenticated])
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


@permission_classes([IsAuthenticated])
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


@permission_classes([IsAuthenticated])
class PoissonsListe(APIView):
    def get(self, request, format=None):
        res = []
        for prod in Poisson.objects.all():
            serializer = PoissonsSerializer(prod)
            response = requests.get(baseUrl+'product/'+str(serializer.data['tigID'])+'/')
            jsondata = response.json()
            res.append(jsondata)
        return JsonResponse(res, safe=False)


@permission_classes([IsAuthenticated])
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


@permission_classes([IsAuthenticated])
class CrustaceanListe(APIView):
    def get(self, request, format=None):
        res = []
        for prod in Crustacean.objects.all():
            serializer = CrustaceansSerializer(prod)
            response = requests.get(baseUrl+'product/'+str(serializer.data['tigID'])+'/')
            jsondata = response.json()
            res.append(jsondata)
        return JsonResponse(res, safe=False)


@permission_classes([IsAuthenticated])
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


@permission_classes([IsAuthenticated])
class CoquillageListe(APIView):
    def get(self, request, format=None):
        res = []
        for prod in Coquillage.objects.all():
            serializer = CoquillagesSerializer(prod)
            response = requests.get(baseUrl+'product/'+str(serializer.data['tigID'])+'/')
            jsondata = response.json()
            res.append(jsondata)
        return JsonResponse(res, safe=False)


@permission_classes([IsAuthenticated])
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




# Doc: Tests uniquement, sert à créer un utilisateur manuellement
from django.contrib.auth.models import User
from django.http import HttpResponse


# @api_view(['GET'])
# def create_user(request):
#     # Création d'un nouvel utilisateur
#     new_user = User.objects.create_user(username='TestUser', password='Test', email='test@test.com')
#
#     # Enregistrement de l'utilisateur dans la base de données
#     new_user.save()
#
#     return HttpResponse('Utilisateur créé avec succès')