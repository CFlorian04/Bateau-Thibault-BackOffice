from django.urls import path, re_path
from monTiGMagasin import views

urlpatterns = [
    path('', views.InfoProductList.as_view() ),
    path('infoproducts/', views.InfoProductList.as_view()),
    path('infoproduct/<int:tig_id>/', views.InfoProductDetail.as_view()),
    # path('products/', views.RedirectionListeDeProduits.as_view()),
    # path('product/<int:pk>/', views.RedirectionDetailProduit.as_view()),
    path('onsaleproducts/', views.PromoList.as_view()),
    path('onsaleproduct/<int:pk>/', views.PromoDetail.as_view()),
    path('shipPoints/', views.ShipPointsList.as_view()),
    path('shipPoint/<int:pk>/', views.RedirectionShipPointDetail.as_view()),
    path('availableProducts/', views.AvailableProducts.as_view()),
    path('availableProduct/<int:pk>/', views.AvailableProductDetail.as_view()),
    path('fishes/', views.PoissonsListe.as_view()),
    path('fish/<int:pk>/', views.PoissonDetail.as_view()),
    path('crustaceans/', views.CrustaceanListe.as_view()),
    path('crustacean/<int:pk>/', views.CrustaceanDetail.as_view()),
    path('shells/', views.CoquillageListe.as_view()),
    path('shell/<int:pk>/', views.CoquillageDetail.as_view()),
    path('putonsale/<int:id>/<str:newprice>/', views.put_on_sale), # Nouvelle URL pour mettre en promotion
    path('removesale/<int:id>/', views.remove_sale),  # Nouvelle URL pour retirer de la promotion
    path('incrementStock/<int:pid>/<int:number>/', views.increment_stock),
    path('decrementStock/<int:pid>/<int:number>/', views.decrement_stock),
    path('showHistory/', views.afficherHistorique),
    path('showObjectHistory/<int:pid>', views.afficherHistoriqueObjet),
    path('addHistory/<str:data>', views.ajouterHistorique),
    path('modifyProduct/<str:data>', views.modifierObjet),
]
