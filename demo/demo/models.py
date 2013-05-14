from django.db import models
from rest_framework import serializers

CATEGORIES = (
    ('Dairy', 'Dairy'),
    ('Bread', 'Bread'),
    ('Meat', 'Meat'),
    ('Vegetable', 'Vegetable'),
    ('Beverage', 'Beverage')
)


class ItemToBuy(models.Model):
    category = models.TextField(choices=CATEGORIES)
    name = models.TextField()
    important = models.BooleanField(default=False)
    created_on = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return self.name

    class Meta:
        ordering = ['name']


class ItemToBuySerializer(serializers.ModelSerializer):

    class Meta:
        model = ItemToBuy
        fields = ('id', 'category', 'name', 'important', 'created_on')
