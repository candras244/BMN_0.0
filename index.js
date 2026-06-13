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

    if(!res.ok){

        throw new Error(
            "Gagal menghubungi API"
        );

    }

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

        <div class="detail-card">

    <img
        src="${foto}"
        class="detail-foto">

    <div class="detail-info">

        <div class="detail-header">

            <div>

                <h2>
                    ${gedung.NAMA_GEDUNG}
                </h2>

                <span class="kode-gedung">

                    ${gedung.KODE_GEDUNG}

                </span>

            </div>

            <a
                class="btn-primary"
                target="_blank"
                href="${API_URL}?action=previewDBRGedung&kodeGedung=${gedung.KODE_GEDUNG}">

                Lihat DBR Gedung

            </a>

        </div>

        <p class="deskripsi">

            ${gedung.DESKRIPSI_SINGKAT || ""}

        </p>

    </div>

</div>

    `;

}

async function detailRuangan(
    kodeRuangan
){

    const result =
        await getAPI(
            "getDetailRuangan" +
            "&kodeRuangan=" +
            kodeRuangan
        );

    if(!result.success){

        alert(
            "Data ruangan tidak ditemukan"
        );

        return;
    }

    const ruang =
        result.ruangan;

    let asetHtml = "";

    result.aset.forEach(
        (aset,index) => {

            asetHtml += `

                <tr>

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${aset.KODE_BARANG || ""}
                    </td>

                    <td>
                        ${aset.NUP || ""}
                    </td>

                    <td>
                        ${aset.NAMA_BARANG || ""}
                    </td>

                    <td>
                        ${aset.JENIS_BARANG || ""}
                    </td>

                    <td>
                        ${aset.MERK_TIPE || ""}
                    </td>

                    <td>
                        ${aset.KONDISI || ""}
                    </td>

                </tr>

            `;

        }
    );

    if(result.aset.length === 0){

        asetHtml = `

            <tr>

                <td
                    colspan="7"
                    style="
                    text-align:center;
                    ">

                    Belum ada aset

                </td>

            </tr>

        `;

    }

    document
        .getElementById(
            "content"
        )
        .innerHTML = `

        <button
            class="btn-back"
            onclick="
                detailGedung(
                    '${ruang.KODE_GEDUNG}'
                )
            ">

            ← Kembali

        </button>

        <div class="detail-gedung">

            <h2>

                ${ruang.NAMA_RUANGAN}

            </h2>

            <p>

                Gedung :
                ${ruang.NAMA_GEDUNG}

            </p>

            <p>

                Jenis Ruangan :
                ${ruang.JENIS_RUANGAN}

            </p>

            <p>

                PIC :
                ${ruang.PIC_RUANGAN}

            </p>

            <p>

                NIP :
                ${ruang.NIP_PIC}

            </p>

            <br>

            <a
                class="btn-primary"
                target="_blank"
                href="${API_URL}?action=previewDBRRuangan&kodeRuangan=${ruang.KODE_RUANGAN}">

                Lihat DBR Ruangan

            </a>

            <br><br>

            <h3>

                Daftar Aset
                (${result.jumlahAset})

            </h3>

            <div
                class="table-wrapper">

                <table
                    class="aset-table">

                    <thead>

                        <tr>

                            <th>No</th>

                            <th>Kode</th>

                            <th>NUP</th>

                            <th>Nama Barang</th>

                            <th>Jenis</th>

                            <th>Merk/Tipe</th>

                            <th>Kondisi</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${asetHtml}

                    </tbody>

                </table>

            </div>

        </div>

    `;

}

