from rest_framework.serializers import ModelSerializer
from mytig.models import ProduitEnPromotion, ProduitDisponible, Poisson, Crustacean, Coquillage


class ProduitEnPromotionSerializer(ModelSerializer):
    class Meta:
        model = ProduitEnPromotion
        fields = ('id', 'tigID')


class AvailableProductSerializer(ModelSerializer):
    class Meta:
        model = ProduitDisponible
        fields = ('id', 'tigID')


class PoissonsSerializer(ModelSerializer):
    class Meta:
        model = Poisson
        fields = ('id', 'tigID')


class CrustaceansSerializer(ModelSerializer):
    class Meta:
        model = Crustacean
        fields = ('id', 'tigID')


class CoquillagesSerializer(ModelSerializer):
    class Meta:
        model = Coquillage
        fields = ('id', 'tigID')

