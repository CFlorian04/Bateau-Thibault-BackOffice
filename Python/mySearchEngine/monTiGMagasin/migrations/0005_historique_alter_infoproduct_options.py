# Generated by Django 4.2.6 on 2023-10-26 19:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('monTiGMagasin', '0004_alter_infoproduct_options_alter_infoproduct_discount'),
    ]

    operations = [
        migrations.CreateModel(
            name='Historique',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('tigID', models.IntegerField(default='-1')),
                ('stock_change', models.IntegerField(default='-1')),
                ('price', models.IntegerField(default='-1')),
            ],
            options={
                'ordering': ('created',),
            },
        ),
        migrations.AlterModelOptions(
            name='infoproduct',
            options={'ordering': ('name',)},
        ),
    ]
