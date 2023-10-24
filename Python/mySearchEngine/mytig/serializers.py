from rest_framework.serializers import ModelSerializer
from mytig.models import ProduitEnPromotion, ProduitDisponible


class ProduitEnPromotionSerializer(ModelSerializer):
    class Meta:
        model = ProduitEnPromotion
        fields = ('id', 'tigID')


class AvailableProductSerializer(ModelSerializer):
    class Meta:
        model = ProduitDisponible
        fields = ('id', 'tigID')
