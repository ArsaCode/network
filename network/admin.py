from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Post, User
# Register your models here.

class UserAdmin(admin.ModelAdmin):
    class Meta:
        model = User

class PostAdmin(admin.ModelAdmin):
    filter_horizontal = ['likes']
    search_fields = ['content', 'author__username', 'author__email']
    
    class Meta:
        model = Post

admin.site.register(Post, PostAdmin)
admin.site.register(User, UserAdmin)