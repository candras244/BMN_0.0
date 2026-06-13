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

async function detailGedung(
    kodeGedung
){

    const result =
        await getAPI(
            "getDetailGedung" +
            "&kodeGedung=" +
            kodeGedung
        );

    if(!result.success){

        alert(
            "Data gedung tidak ditemukan"
        );

        return;
    }

    const gedung =
        result.gedung;

    let jenisHtml = "";

    Object.keys(
        result.jenisRuangan
    ).forEach(
        jenis => {

            jenisHtml += `
                <li>
                    ${jenis}
                    :
                    ${result.jenisRuangan[jenis]}
                </li>
            `;

        }
    );

    let ruangHtml = "";

    result.daftarRuangan.forEach(
        ruang => {

            ruangHtml += `

                <div class="ruang-card">

                    <div>

                        <h4>
                            ${ruang.NAMA_RUANGAN}
                        </h4>

                        <small>
                            ${ruang.JENIS_RUANGAN}
                        </small>

                    </div>

                    <button
                        class="btn-primary"
                        onclick="
                            detailRuangan(
                                '${ruang.KODE_RUANGAN}'
                            )
                        ">
                        Lihat
                    </button>

                </div>

            `;

        }
    );

    document
        .getElementById(
            "content"
        )
        .innerHTML = `

        <button
            class="btn-back"
            onclick="loadGedung()">

            ← Kembali

        </button>

        <div class="detail-gedung">

            <h2>
                ${gedung.NAMA_GEDUNG}
            </h2>

            <p>
                ${gedung.DESKRIPSI_SINGKAT || ""}
            </p>

            <div class="info-box">

                <div>

                    <h3>
                        ${result.jumlahRuangan}
                    </h3>

                    <span>
                        Ruangan
                    </span>

                </div>

            </div>

            <div class="jenis-box">

                <h3>
                    Jenis Ruangan
                </h3>

                <ul>
                    ${jenisHtml}
                </ul>

            </div>

            <div
                style="
                margin:20px 0;
                ">

                <a
                    class="btn-primary"
                    target="_blank"
                    href="
                    ${API_URL}
                    ?action=previewDBRGedung
                    &kodeGedung=
                    ${gedung.KODE_GEDUNG}
                    ">

                    Lihat DBR Gedung

                </a>

            </div>

            <h3>
                Daftar Ruangan
            </h3>

            <div
                class="ruangan-list">

                ${ruangHtml}

            </div>

        </div>

    `;

}

