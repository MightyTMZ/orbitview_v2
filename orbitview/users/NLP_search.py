from sklearn.metrics.pairwise import cosine_similarity
from .models import Profile
from transformers import pipeline
import numpy as np
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

class NLPSearchProfilesAPIView(APIView):
    permission_classes = [IsAuthenticated]


    def post(self, request):
        query = request.data.get('query', '')
        embedder = pipeline("feature-extraction", model="sentence-transformers/all-MiniLM-L6-v2")
        query_embedding = np.array(embedder(query)[0])
        
        # heavy computing 🥵
        profiles = Profile.objects.all()
        profile_embeddings = np.array([np.array(p.embedding) for p in profiles])
        similarity_scores = cosine_similarity([query_embedding], profile_embeddings)[0]
        
        results = sorted(
            zip(profiles, similarity_scores),
            key=lambda x: x[1],
            reverse=True
        )[:10]  # Top 10 matches
        
        response_data = [
            {"id": p.user.id, "name": p.user.username, "similarity": score}
            for p, score in results
        ]
        return JsonResponse(response_data, safe=False)
