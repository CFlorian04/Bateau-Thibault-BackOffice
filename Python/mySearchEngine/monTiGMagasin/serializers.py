from rest_framework.serializers import ModelSerializer
from monTiGMagasin.models import InfoProduct, ProduitEnPromotion, ProduitDisponible, Poisson, Crustacean, Coquillage, Historique


class InfoProductSerializer(ModelSerializer):
    class Meta:
        model = InfoProduct
        fields = ('id', 'tig_id', 'name', 'category', 'price', 'unit', 'availability', 'sale', 'discount', 'comments', 'owner', 'quantityInStock')


class HistoriqueSerializer(ModelSerializer):
    class Meta:
        model = Historique
        fields = ('tigID', 'stock_change', 'price', 'date')


# Doc: FROM OLD FILES
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

