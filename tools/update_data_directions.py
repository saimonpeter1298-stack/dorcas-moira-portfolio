import re

with open('js/data.js', 'r', encoding='utf-8') as f:
    content = f.read()

old_directions = '''    artisticDirections: [
      "Editorial Fashion",
      "Lifestyle",
      "Studio Portrait",
      "Commercial Campaign",
      "Video & Motion"
    ],'''

new_directions = '''    artisticDirections: [
      {
        id: "editorial-fashion",
        num: "01",
        titleMain: "Editorial",
        titleAccent: "Fashion",
        filter: "editorial",
        image: "assets/images/03-afro-chic-01.jpg",
        focus: "50% 25%",
        descFr: "Silhouettes audacieuses, pagnes revisités et jeux de contrastes pour les séries mode haute couture.",
        descEn: "Bold silhouettes, modern heritage weaves, and striking contrasts for high-fashion spreads."
      },
      {
        id: "lifestyle",
        num: "02",
        titleMain: "Life",
        titleAccent: "style",
        filter: "lifestyle",
        image: "assets/images/02-many-moods-01.jpg",
        focus: "45% 30%",
        descFr: "Spontanéité solaire, allure urbaine et matières nobles pour le prêt-à-porter contemporain.",
        descEn: "Sun-drenched spontaneity, natural textures, and urban chic for contemporary ready-to-wear."
      },
      {
        id: "studio-portrait",
        num: "03",
        titleMain: "Studio",
        titleAccent: "Portrait",
        filter: "portrait",
        image: "assets/images/about-portrait.jpg",
        focus: "50% 30%",
        descFr: "Lumière feutrée, intensité du regard et présence sculpturale au service de la beauté pure.",
        descEn: "Masterful studio lighting, commanding gaze, and sculptural poise before the lens."
      },
      {
        id: "commercial-campaign",
        num: "04",
        titleMain: "Commercial",
        titleAccent: "Campaign",
        filter: "commercial",
        image: "assets/images/hero-portrait.jpg",
        focus: "45% 30%",
        descFr: "Énergie magnétique, port de tête altier et valorisation immédiate des pièces clés de marques.",
        descEn: "Magnetic energy and high-end garment desirability for flagship brand campaigns."
      },
      {
        id: "video-motion",
        num: "05",
        titleMain: "Video &",
        titleAccent: "Motion",
        filter: "motion",
        image: "assets/images/comp-card-full.jpg",
        focus: "50% 40%",
        descFr: "Fluidité du mouvement, drapés en apesanteur et narration vivante pour films de mode et digital.",
        descEn: "Kinetic grace, drape fluidity, and living rhythm for brand films and digital storytelling."
      }
    ],'''

if old_directions in content:
    content = content.replace(old_directions, new_directions)
    with open('js/data.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated data.js with rich artistic directions")
else:
    print("Warning: old_directions not found exactly")
