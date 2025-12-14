// ==========================================
// 1. FIREBASE CONFIGURATION
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, getDocs, writeBatch, doc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// YOUR CONFIG - Paste here
const firebaseConfig = {
    apiKey: "AIzaSyA4vJNC8QZsVVwM4Rcr2h7HcYDq--Oj1MY",
    authDomain: "sohamcreationandpublication.firebaseapp.com",
    projectId: "sohamcreationandpublication",
    storageBucket: "sohamcreationandpublication.firebasestorage.app",
    messagingSenderId: "173644617844",
    appId: "1:173644617844:web:3e1cc7d29388530d791921",
    measurementId: "G-5X30PL126R"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Use NEW Collection Names
const BOOKS_COLLECTION = "bookss";
const SALES_COLLECTION = "saless";

let inventoryCache = [];

// ==========================================
// 2. MASTER BOOK LIST (75 Items)
// ==========================================
const pdfBooksData = [
    { title: "Soliv Sukh (सोलीव सुख)", price: 250, category: "Spiritual" },
    { title: "Atmaram-Amrutanubhav (आत्माराम-अमृतानुभव)", price: 150, category: "Spiritual" },
    { title: "Samarth Ek Patrakar (समर्थ एक पत्रकार)", price: 125, category: "Biography" },
    { title: "Samarth Ramdasanchi Vyavasthapan Drushti", price: 150, category: "Management" },
    { title: "Vishwache Aart (विश्वाचे आर्त)", price: 200, category: "Biography" },
    { title: "Shriramkrishna (श्रीरामकृष्ण)", price: 300, category: "Biography" },
    { title: "Majha Atmavikas Majhya Hati", price: 250, category: "Self-Help" },
    { title: "Ramayan: Mahatva Ani Vyakti Vishesh (Marathi)", price: 150, category: "Religious" },
    { title: "Ramayan: Mahatva Ani Vyakti Vishesh (Hindi)", price: 200, category: "Religious" },
    { title: "Ramayan: Mahatva Ani Vyakti Vishesh (English)", price: 200, category: "Religious" },
    { title: "Savitri Darshan (सावित्री दर्शन)", price: 100, category: "Poetry" },
    { title: "Maharishi Valmiki (Marathi)", price: 80, category: "Biography" },
    { title: "Maharishi Valmiki (Hindi)", price: 100, category: "Biography" },
    { title: "Maharishi Valmiki (English)", price: 100, category: "Biography" },
    { title: "Samarth Krupechi Vachane", price: 150, category: "Spiritual" },
    { title: "Saptachakravedh (सप्तचक्रवेध)", price: 100, category: "Spiritual" },
    { title: "Acharya Panchapradeep", price: 200, category: "Religious" },
    { title: "Bhaskarayana (भास्करायण)", price: 350, category: "Novel" },
    { title: "Ojaswi (ओजस्वी)", price: 200, category: "Novel" },
    { title: "Kalyatri (कालयात्री)", price: 250, category: "Novel" },
    { title: "Trima Kasi (Marathi)", price: 350, category: "Novel" },
    { title: "Trima Kasi (English)", price: 350, category: "Novel" },
    { title: "Shikhandi (शिखंडी)", price: 200, category: "Novel" },
    { title: "Garbhit Hunkar", price: 500, category: "Novel" },
    { title: "Daityasutra (दैत्यसूत्र)", price: 350, category: "Horror" },
    { title: "Baykochi Ekasathi Navryachi Shashti", price: 250, category: "Humor" },
    { title: "Naivedya (नैवेद्य)", price: 150, category: "Stories" },
    { title: "Bindhast (बिनधास्त)", price: 300, category: "Stories" },
    { title: "Urle Urat Kahi (उरले उरात काही)", price: 200, category: "Stories" },
    { title: "Ajunahi Chandrat Aahe", price: 200, category: "Articles" },
    { title: "Chandane Shabdafulanche", price: 200, category: "Articles" },
    { title: "Anandanidhan", price: 200, category: "Articles" },
    { title: "Road to Holland (Marathi)", price: 300, category: "Travel" },
    { title: "Road to Holland (English)", price: 300, category: "Travel" },
    { title: "Road to Holland Particha Pravas", price: 300, category: "Travel" },
    { title: "Road to Dusseldorf", price: 350, category: "Travel" },
    { title: "Lal Dinank (लाल दिनांक)", price: 150, category: "Children" },
    { title: "Guni Mule (गुणी मुले)", price: 75, category: "Children" },
    { title: "Vidnyan Balkatha", price: 75, category: "Children" },
    { title: "Shastradnyanchya Katha", price: 80, category: "Children" },
    { title: "Tenali Ram Ani Birbalachya Goshti", price: 80, category: "Children" },
    { title: "Mantryanni Ghetli Shala", price: 80, category: "Children" },
    { title: "Raja Maharajanchya Goshti", price: 80, category: "Children" },
    { title: "Promise Pariche", price: 100, category: "Children" },
    { title: "Chingi Ani Jaduche Phulpakhru", price: 100, category: "Children" },
    { title: "English Balkatha Sangrah", price: 80, category: "Children" },
    { title: "Pakshigatha (पक्षिगाथा)", price: 150, category: "Nature" },
    { title: "Dhagdhagatya Samidha", price: 250, category: "History" },
    { title: "Nisargachi Navalai Part 1", price: 300, category: "Nature" },
    { title: "Nisargachi Navalai Part 2", price: 250, category: "Nature" },
    { title: "Subhashit Saurabh", price: 150, category: "Literature" },
    { title: "Subhashit Parimal", price: 150, category: "Literature" },
    { title: "Ranjak Vidnyan", price: 150, category: "Science" },
    { title: "Ase Ghadle Shastra", price: 200, category: "Science" },
    { title: "The Students Syndrome", price: 125, category: "Edu" },
    { title: "Marathi Santanchya Hindi Bhaktirachana", price: 300, category: "Poetry" },
    { title: "Abhijat Kavyachi Olakh", price: 200, category: "Poetry" },
    { title: "Kavyanubhuti", price: 250, category: "Poetry" },
    { title: "Lavani (लावणी)", price: 200, category: "Art" },
    { title: "1965 Cha Vijay", price: 100, category: "Defense" },
    { title: "Dharmanishtha Savarkar", price: 150, category: "Biography" },
    { title: "Savarkar Samjun Ghetana", price: 200, category: "Biography" },
    { title: "Shri Dnyaneshwaritil Pratima Srushti", price: 200, category: "Spirituality" },
    { title: "Mahabharatatil Aparichit Goshti", price: 200, category: "Mythology" },
    { title: "Guptaheranche Vishwa", price: 200, category: "Mystery" },
    { title: "Anandayatri Rabindranath", price: 300, category: "Biography" },
    { title: "Pustakatil Manasa", price: 200, category: "Literature" },
    { title: "Aarti (Shabdarth, Bhavarth)", price: 100, category: "Religious" },
    { title: "Shriram Visheshank", price: 200, category: "Magazine" },
    { title: "Sant Vangmay Visheshank", price: 250, category: "Magazine" },
    { title: "Paryatan Ani Paryavaran Visheshank", price: 250, category: "Magazine" },
    { title: "Swarsaj Visheshank", price: 350, category: "Magazine" },
    { title: "Chhatrapati Shivaji Maharaj Visheshank", price: 300, category: "Magazine" },
    { title: "Hasyanand Visheshank", price: 250, category: "Magazine" },
    { title: "Katha Visheshank", price: 250, category: "Magazine" }
];

// ==========================================
// 3. ADMIN UPLOAD (Uses 'bookss')
// ==========================================
window.uploadAllBooks = async () => {
    const btn = document.querySelector('.btn-danger');
    if (btn) { btn.innerText = "Uploading to 'bookss'..."; btn.disabled = true; }
    
    try {
        const batch = writeBatch(db);
        const booksRef = collection(db, BOOKS_COLLECTION);
        
        pdfBooksData.forEach(book => {
            const newRef = doc(booksRef);
            batch.set(newRef, book);
        });

        await batch.commit();
        alert("Success! 75 Books uploaded to 'bookss'.");
        if(btn) btn.innerText = "Done!";
    } catch (error) {
        console.error("Upload Error:", error);
        alert("Upload Failed: " + error.message);
        if(btn) btn.disabled = false;
    }
}

// ==========================================
// 4. SALES LOGIC (index.html)
// ==========================================
const homeDropdown = document.getElementById("bookSelect");

if (homeDropdown) {
    async function initInventory() {
        try {
            // Read from 'bookss'
            const snapshot = await getDocs(collection(db, BOOKS_COLLECTION));
            
            if (snapshot.empty) {
                homeDropdown.innerHTML = "<option>Database empty. Go to upload.html</option>";
                return;
            }

            inventoryCache = [];
            snapshot.forEach(doc => {
                inventoryCache.push({ id: doc.id, ...doc.data() });
            });
            renderDropdown(inventoryCache);

        } catch (error) {
            console.error("Fetch Error:", error);
            homeDropdown.innerHTML = "<option>Error loading database.</option>";
        }
    }

    function renderDropdown(books) {
        if (books.length === 0) {
            homeDropdown.innerHTML = '<option value="">No matches</option>';
            return;
        }
        homeDropdown.innerHTML = '<option value="">-- Select Book --</option>';
        books.forEach(book => {
            const opt = document.createElement("option");
            opt.value = book.id;
            opt.innerText = book.title;
            opt.dataset.price = book.price;
            opt.dataset.category = book.category;
            homeDropdown.appendChild(opt);
        });
    }

    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = inventoryCache.filter(b => 
                b.title.toLowerCase().includes(term) || 
                b.category.toLowerCase().includes(term)
            );
            renderDropdown(filtered);
        });
    }

    homeDropdown.addEventListener("change", (e) => {
        const opt = e.target.options[e.target.selectedIndex];
        if (opt.value) {
            document.getElementById("bookTitle").innerText = opt.innerText;
            document.getElementById("bookPrice").innerText = "₹" + opt.dataset.price;
            document.getElementById("bookCategory").innerText = opt.dataset.category;
            document.getElementById("previewImg").src = `https://placehold.co/100x150?text=${opt.innerText.substring(0,3)}`;
            updateTotal();
        }
    });

    const qtyInput = document.getElementById("qtyInput");
    if (qtyInput) qtyInput.addEventListener("input", updateTotal);

    function updateTotal() {
        const opt = homeDropdown.options[homeDropdown.selectedIndex];
        const val = document.getElementById("qtyInput").value;
        const display = document.getElementById("totalDisplay");
        if (opt.value && display) {
            display.value = "₹" + (parseInt(opt.dataset.price) * parseInt(val));
        }
    }

    window.recordSale = async () => {
        const opt = homeDropdown.options[homeDropdown.selectedIndex];
        const qtyVal = document.getElementById("qtyInput").value;

        if (!opt.value) { alert("Select a book"); return; }

        const statusMsg = document.getElementById("statusMessage");
        if(statusMsg) statusMsg.innerText = "Saving to 'saless'...";

        try {
            // Write to 'saless'
            await addDoc(collection(db, SALES_COLLECTION), {
                bookId: opt.value,
                bookTitle: opt.innerText,
                category: opt.dataset.category,
                price: parseInt(opt.dataset.price),
                quantity: parseInt(qtyVal),
                totalAmount: parseInt(opt.dataset.price) * parseInt(qtyVal),
                timestamp: new Date()
            });
            
            if(statusMsg) statusMsg.innerText = "Sale Saved! ✅";
            
            const list = document.getElementById("recentSalesList");
            const li = document.createElement("li");
            li.innerHTML = `<span>${opt.innerText}</span> <span style="color:#888;">x${qtyVal}</span>`;
            list.prepend(li);
            
            document.getElementById("qtyInput").value = 1;
            updateTotal();

        } catch (e) {
            alert("Error: " + e.message);
        }
    }

    initInventory();
}

// ==========================================
// 5. INVENTORY PAGE LOGIC (inventory.html)
// ==========================================
const invContainer = document.getElementById("inventoryContainer");

if (invContainer) {
    async function loadCatalog() {
        // Read from 'bookss'
        const snapshot = await getDocs(collection(db, BOOKS_COLLECTION));
        const groupedBooks = {};
        
        snapshot.forEach(doc => {
            const b = doc.data();
            if (!groupedBooks[b.category]) groupedBooks[b.category] = [];
            groupedBooks[b.category].push(b);
        });

        Object.keys(groupedBooks).sort().forEach(category => {
            const header = document.createElement("div");
            header.className = "category-header";
            header.innerText = category;
            invContainer.appendChild(header);

            const grid = document.createElement("div");
            grid.className = "book-grid";

            groupedBooks[category].forEach(book => {
                const card = document.createElement("div");
                card.className = "book-card";
                card.innerHTML = `<h4>${book.title}</h4> <span class="badge price">₹${book.price}</span>`;
                grid.appendChild(card);
            });
            invContainer.appendChild(grid);
        });
    }
    loadCatalog();
}

// ==========================================
// 6. ANALYTICS LOGIC (analytics.html)
// ==========================================
if (document.getElementById("analyticsPage")) {
    async function loadAnalytics() {
        // Read from 'saless'
        const snapshot = await getDocs(collection(db, SALES_COLLECTION));
        
        let bookCounts = {};
        let genreCounts = {};
        let totalSold = 0;
        
        snapshot.forEach(doc => {
            const data = doc.data();
            const qty = data.quantity || 1;
            bookCounts[data.bookTitle] = (bookCounts[data.bookTitle] || 0) + qty;
            genreCounts[data.category] = (genreCounts[data.category] || 0) + qty;
            totalSold += qty;
        });

        document.getElementById("totalBooksSold").innerText = totalSold;

        const sortedBooks = Object.entries(bookCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

        if(document.getElementById("topItemsChart")) {
            new Chart(document.getElementById("topItemsChart"), {
                type: 'bar',
                data: {
                    labels: sortedBooks.map(i => i[0]), 
                    datasets: [{ label: 'Sold', data: sortedBooks.map(i => i[1]), backgroundColor: '#3b82f6' }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }

        if(document.getElementById("genreChart")) {
            new Chart(document.getElementById("genreChart"), {
                type: 'doughnut',
                data: {
                    labels: Object.keys(genreCounts),
                    datasets: [{ data: Object.values(genreCounts), backgroundColor: ['#ef4444', '#f97316', '#10b981', '#3b82f6', '#8b5cf6'] }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }
    }
    loadAnalytics();
}
