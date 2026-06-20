import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image

MODEL_PATH = "eurosat_model.pth"
IMAGE_SIZE = 64

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

checkpoint = torch.load(MODEL_PATH, map_location=device)
class_names = checkpoint["class_names"]

model = models.mobilenet_v2(weights=None)
model.classifier[1] = nn.Linear(
    model.classifier[1].in_features,
    len(class_names)
)

model.load_state_dict(checkpoint["model_state_dict"])
model = model.to(device)
model.eval()

transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


def classify_satellite_image(image_path: str):
    image = Image.open(image_path).convert("RGB")
    image_tensor = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(image_tensor)
        probabilities = torch.softmax(outputs, dim=1)
        confidence, predicted_index = torch.max(probabilities, 1)

    predicted_class = class_names[predicted_index.item()]
    confidence_score = round(confidence.item() * 100, 2)

    return {
        "predicted_class": predicted_class,
        "confidence": confidence_score
    }