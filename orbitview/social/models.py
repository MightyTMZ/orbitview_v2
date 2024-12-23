from django.db import models
from django.contrib.auth.models import User

class ConnectionList(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='user')
    connections = models.ManyToManyField(User, blank=True, related_name='friends')
    
    def __str__(self):
        return self.user.username

    def add_connection(self, account):
        if not account in self.connections.all():
            self.connections.add(account)
            self.save()

    def remove_connection(self, account):
        if account in self.friends.all():
            self.connections.remove(account)
            self.save()

    def unconnect(self, removee):
        remover_friends_list = self
        remover_friends_list.remove_connection(removee)

        friends_list = ConnectionList.objects.get(user=removee)
        friends_list.remove_connection(self.user)

    def is_mutual_connection(self, friend):
        if friend in self.connections.all():
            return True
        return False
    

class ConnectionRequest(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sender')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='receiver')
    is_active = models.BooleanField(blank=True, null=True, default=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.sender.username

    def accept(self):
        # update both sender and receiver friend list
        receiver_friend_list = ConnectionList.objects.get(user=self.receiver)
        if receiver_friend_list:
            receiver_friend_list.add_connection(self.sender)
            sender_friend_list = ConnectionList.objects.get(user=self.sender)
            if sender_friend_list:
                sender_friend_list.add_connection(self.receiver)
                self.is_active = False
                self.save()

    def decline(self):
        self.is_active = False
        self.save()

    def cancel(self):
        self.is_active = False
        self.save()
