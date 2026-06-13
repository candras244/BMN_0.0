const API_URL =
"https://script.google.com/macros/s/AKfycbwS70V3L1nb6lCOS_pTGhBE2DQwW9PyuTUXIhL4nKTwAJGvnFALjlOAWvzgkmUGQj3pOg/exec";

document.addEventListener(
    "DOMContentLoaded",
    loadGedung
);

async function getAPI(action){

    const res =
        await fetch(
            API_URL +
            "?action=" +
            action
        );

    return await res.json();

}

async function loadGedung(){

    const result =
        await getAPI(
            "getGedung"
        );

    let html = `

        <h2 class="page-title">
            Daftar Gedung
        </h2>

        <div class="gedung-grid">

    `;

    result.data.forEach(
        gedung => {

            const foto =
                gedung.FOTO_GEDUNG
                ?
                `https://drive.google.com/uc?export=view&id=${gedung.FOTO_GEDUNG}`
                :
                "https://via.placeholder.com/600x350";

            html += `

                <div class="card">

                    <img
                        src="${foto}"
                        class="card-image">

                    <div class="card-body">

                        <h3>
                            ${gedung.NAMA_GEDUNG}
                        </h3>

                        <p>
                            ${gedung.DESKRIPSI_SINGKAT || ""}
                        </p>

                        <a
                            href="#"
                            onclick="
                                detailGedung(
                                    '${gedung.KODE_GEDUNG}'
                                )
                            ">
                            Lihat Detail
                        </a>

                    </div>

                </div>

            `;

        }
    );

    html += `
        </div>
    `;

    document
        .getElementById(
            "content"
        )
        .innerHTML =
        html;

}
