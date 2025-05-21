const map = L.map('map').setView([31.9522, 35.2332], 8);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

map.locate({ setView: true, maxZoom: 13 });
map.on('locationfound', function (e) {
  L.marker(e.latlng).addTo(map).bindPopup("أنت هنا 🧭").openPopup();
});

const locations = [
  {
    type: "danger",
    coords: [31.95, 35.23],
    title: "Danger Zone - Ramallah",
    description: "Protest area. Avoid the location.",
    image: "images/danger.jpg"
  },
  {
    type: "medical",
    coords: [32.1897, 34.9706],
    title: "Medical Center - Qalqilya",
    description: "Medical Center operating 24/7.",
    image: "images/clinic.jpg"
  },
  {
    type: "resources",
    coords: [31.5010, 34.4667],
    title: "Food Distribution - Khan Yunis",
    description: "Relief point for families.",
    image: "images/relief.jpg"
  },
  {
    type: "resources",
    coords: [32.4650, 35.3000], 
    title: "Food Shelter - Jenin",
    description: "Daily meals for affected families.",
    image: "images/jenin-food.jpg"
  },
  {
    type: "medical",
    coords: [31.7784, 35.2332], 
    title: "Al Makassed Hospital - Jerusalem",
    description: "Key medical center serving East Jerusalem.",
    image: "images/makassed.jpg"
  },
  {
    type: "danger",
    coords: [31.2800, 34.2700], 
    title: "Danger Zone - Rafah",
    description: "Tensions reported. Stay cautious.",
    image: "images/rafah-danger.jpg"
  },
  {
    type: "medical",
    coords: [32.3103, 35.0286], 
    title: "Thabt Thabt Hospital",
    description: "Public hospital serving northern West Bank.",
    image: "images/tulkarm-hospital.jpg"
  }, {
    type: "resources",
    coords: [31.9050, 35.1950], 
    title: "Water Distribution Point - Bethlehem",
    description: "Water tanks available for public use.",
    image: "images/water.jpg"
  },
  {
    type: "medical",
    coords: [32.2222, 35.2611], 
    title: "Nablus Charitable Medical Center",
    description: "It has all the therapeutic departments.",
    image: "images/nablus-clinic.jpg"
  },
  {
    type: "resources",
    coords: [31.4682, 34.3925], 
    title: "Shelter Camp - Deir al-Balah",
    description: "Temporary tents for displaced families.",
    image: "images/deir-camp.jpg"
  },
  {
    type: "danger",
    coords: [32.34008999851338, 35.39789684573604], 
    title: "Military Activity - Tubas",
    description: "Reported military checkpoints and tension.",
    image: "images/tubas-checkpoint.jpg"
  },
  {
    type: "danger",
    coords: [32.104447138904455, 35.215147629937825],
    title: "Danger Zone - Salfit",
    description: "Protest area. Avoid the location.",
    image: "images/salfit.jpg"
  },
  {
    type: "danger",
    coords: [31.951009966660582, 34.88758952577372], 
    title: "Clashes in Lod",
    description: "Recent unrest reported in central Lod.",
    image: "images/lod.jpg"
  },
  {
    type: "medical",
    coords: [31.86236004472783, 35.46262612816392], 
    title: "Jericho Health Center",
    description: "Public clinic in the Jericho.",
    image: "images/jericho-clinic.jpg"
  },
  {
    type: "danger",
    coords: [31.5340, 35.0955], 
    title: "Security Zone - Hebron",
    description: "Restricted access area. Military presence.",
    image: "images/hebron-security.jpg"
  }
];

let markerGroup = [];

function getSelectedFilters() {
  const checkboxes = document.querySelectorAll('#filterForm input[type="checkbox"]:checked');
  return Array.from(checkboxes).map(cb => cb.value);
}

function renderMarkers() {
  markerGroup.forEach(m => map.removeLayer(m));
  markerGroup = [];

  const selectedTypes = getSelectedFilters();

  locations.forEach(loc => {
    if (selectedTypes.includes(loc.type)) {
      const color = loc.type === "danger" ? "red"
                  : loc.type === "medical" ? "green"
                  : "blue";

      const icon = L.AwesomeMarkers.icon({
        icon: 'info-sign',
        markerColor: color,
        prefix: 'glyphicon'
      });

      const marker = L.marker(loc.coords, { icon })
        .bindPopup(`
          <b>${loc.title}</b><br>
          ${loc.description}<br>
          <img src="${loc.image}" width="200">
        `)
        .addTo(map);

      markerGroup.push(marker);
    }
  });
}

document.getElementById("filterForm").addEventListener("change", renderMarkers);
renderMarkers();
