from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

User = get_user_model()

class Command(BaseCommand):
    help = 'Create a new user'

    def add_arguments(self, parser):
        parser.add_argument('email', type=str, help='User email')
        parser.add_argument('password', type=str, help='User password')

    def handle(self, *args, **kwargs):
        email = kwargs['email']
        password = kwargs['password']
        
        if not User.objects.filter(email=email).exists():
            User.objects.create_user(email=email, password=password)
            self.stdout.write(self.style.SUCCESS(f'Successfully created user with email {email}'))
        else:
            self.stdout.write(self.style.WARNING(f'User with email {email} already exists'))


