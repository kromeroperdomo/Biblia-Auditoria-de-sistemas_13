document.addEventListener('DOMContentLoaded', () => {
    const keywordsContainer = document.getElementById('keywords-container');
    const resultsPanel = document.getElementById('results-panel');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    let auditData = [];

    // 1. Cargar la base de datos JSON de forma asíncrona
    fetch('data/normatividad.json')
        .then(response => response.json())
        .then(data => {
            auditData = data;
            renderKeywords(auditData);
        })
        .catch(error => {
            console.error('Error cargando la normatividad:', error);
            resultsPanel.innerHTML = '<p>Error al cargar la base de datos de auditoría.</p>';
        });

    // 2. Renderizar el Índice Interactivo de Palabras Clave
    function renderKeywords(data) {
        keywordsContainer.innerHTML = '';
        data.forEach(item => {
            const btn = document.createElement('button');
            btn.classList.add('keyword-tag');
            btn.textContent = item.palabra_clave;
            
            // Al hacer clic en un tag, ejecuta la búsqueda automáticamente
            btn.addEventListener('click', () => {
                searchInput.value = item.palabra_clave;
                filterResults(item.palabra_clave);
            });
            
            keywordsContainer.appendChild(btn);
        });
    }

    // 3. Renderizar las Fichas Ejecutivas de Auditoría
    function renderCards(data) {
        resultsPanel.innerHTML = '';
        
        if (data.length === 0) {
            resultsPanel.innerHTML = '<p style="text-align:center; color:var(--text-secondary);">No se encontraron controles o normativas para esta búsqueda.</p>';
            return;
        }

        data.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('audit-card');
            
            // Construir las viñetas cortas para la evidencia
            const evidenciasHTML = item.evidencia_esperada
                .map(evi => `<li>${evi}</li>`)
                .join('');

            card.innerHTML = `
                <h3>${item.palabra_clave}</h3>
                <p><span class="label">Norma / Numeral:</span> ${item.norma_numeral}</p>
                <p><span class="label">Objetivo de Control:</span> ${item.objetivo_control}</p>
                <p><span class="label">Evidencia Esperada:</span></p>
                <ul>${evidenciasHTML}</ul>
                <p><span class="label">Prueba / Técnica:</span> ${item.prueba_tecnica}</p>
                <p><span class="label">Riesgo Asociado:</span> ${item.riesgo_asociado}</p>
            `;
            resultsPanel.appendChild(card);
        });
    }

    // 4. Lógica del buscador en tiempo real
    function filterResults(query) {
        const term = query.toLowerCase().trim();
        
        // Si el buscador está vacío, limpiar los resultados
        if (term === '') {
            resultsPanel.innerHTML = '';
            return;
        }

        // Filtrar por palabra clave, norma o contenido del objetivo
        const filtered = auditData.filter(item => 
            item.palabra_clave.toLowerCase().includes(term) ||
            item.norma_numeral.toLowerCase().includes(term) ||
            item.objetivo_control.toLowerCase().includes(term)
        );

        renderCards(filtered);
    }

    // 5. Escuchadores de eventos para la barra de búsqueda
    searchBtn.addEventListener('click', () => filterResults(searchInput.value));
    
    // Ejecutar filtro mientras el usuario escribe (Tiempo real)
    searchInput.addEventListener('keyup', (e) => {
        filterResults(searchInput.value);
    });
});
