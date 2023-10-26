cd [..path_to_dir..]/mySearchEngine &&
source ../mySearchEngineVEnv/bin/activate &&
python manage.py refreshOnSaleList >> ~/mySearchEngineLog &&
python manage.py refreshAvailableProducts >> ~/mySearchEngineLog &&
python manage.py refreshCoquillageList >> ~/mySearchEngineLog &&
python manage.py refreshCrustaceanList >> ~/mySearchEngineLog &&
python manage.py refreshFishList >> ~/mySearchEngineLog &&
deactivate
