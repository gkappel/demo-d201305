from django.views.generic import TemplateView
from rest_framework import generics
from .models import ItemToBuy, ItemToBuySerializer, CATEGORIES


class Index(TemplateView):
    template_name = 'index.html'

    def get_context_data(self, **kwargs):
        context = super(Index, self).get_context_data(**kwargs)
        context.update({'CATEGORIES': [a[0] for a in CATEGORIES]})
        return context


class ItemList(generics.ListCreateAPIView):
    """
    API endpoint that represents a list of items to buy.
    """
    model = ItemToBuy
    serializer_class = ItemToBuySerializer


class ItemDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint that represents a single item to buy.
    """
    model = ItemToBuy
    serializer_class = ItemToBuySerializer
