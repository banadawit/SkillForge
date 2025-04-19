from django.db import migrations, models
import django.utils.timezone

class Migration(migrations.Migration):

    dependencies = [
        ('skills', '0002_availability'),
    ]

    operations = [
        migrations.RenameField(
            model_name='skill',
            old_name='name',
            new_name='title',
        ),
        migrations.AddField(
            model_name='skill',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='skill',
            name='level',
            field=models.CharField(default='Beginner', max_length=50),  # Change to a valid default like 'Beginner'
            preserve_default=False,
        ),
    ]
