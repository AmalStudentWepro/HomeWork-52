

export function createHeader() {
  const header = document.createElement('header');
  header.className = 'site-header';

  header.innerHTML = `
    <div class="logo">
      <img src="/public/img/uzum.png" />
      <span>Uzum market</span>
    </div>
    <button class="catalog-button">Каталог</button>
    <div class="search">
      <input placeholder="Искать товары и категории" />
      <img src="https://cdn-icons-png.flaticon.com/512/622/622669.png" alt="Поиск" />
    </div>
    <div class="actions">
      <a href="#" class="icon"><img src="/img/user.webp" /><span>Войти</span></a>
      <a href="#" class="icon"><img src="/img/heart.webp" /><span>Избранное</span></a>
      <a href="#" class="icon"><img src="/img/korzina.png" /><span>Корзина</span></a>
    </div>
  `;

  document.body.appendChild(header);

  const catalogButton = header.querySelector('.catalog-button');
  const searchInput = header.querySelector('.search input');

  let categoriesVisible = false;
  let categoriesBlock = null;

  catalogButton.addEventListener('click', () => {
    const existingOverlay = document.querySelector('.overlay');

    if (!categoriesVisible) {
      axios.get('http://localhost:3000/goods')
        .then(res => {
          const goods = res.data;
          const types = [...new Set(goods.map(good => good.type))];
          const counts = {};

          goods.forEach(g => {
            counts[g.type] = (counts[g.type] || 0) + 1;
          });

          if (categoriesBlock) categoriesBlock.remove();

          categoriesBlock = document.createElement('div');
          categoriesBlock.className = 'catalog-menu';
          categoriesBlock.innerHTML = `
            <p class="catalog-title">Категории товаров</p>
            ${types.map(type => `
              <div class="catalog-item">
                <h3>${type}</h3>
                <span class="count-badge">${counts[type]} товаров</span>
              </div>
            `).join('')}
          `;
          document.body.appendChild(categoriesBlock);

          const overlay = document.createElement('div');
          overlay.className = 'overlay';
          overlay.addEventListener('click', () => {
            categoriesBlock.classList.remove('open');
            overlay.remove();
            categoriesVisible = false;
          });

          document.body.appendChild(overlay);

          requestAnimationFrame(() => {
            categoriesBlock.classList.add('open');
            overlay.classList.add('active');
          });

          categoriesVisible = true;
        })
        .catch(err => console.error(err));
    } else {
      if (categoriesBlock) categoriesBlock.classList.remove('open');
      if (existingOverlay) existingOverlay.remove();
      categoriesVisible = false;
    }
  });

  let searchResultsBlock = null;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();

    if (searchResultsBlock) {
      searchResultsBlock.remove();
      searchResultsBlock = null;
    }

    if (query.length === 0) return;

    axios.get('http://localhost:3000/goods')
      .then(res => {
        const goods = res.data.filter(g => g.title.toLowerCase().includes(query));

        const blur = document.createElement('div');
        blur.className = 'blur';
        blur.addEventListener('click', () => {
          blur.remove();
          if (searchResultsBlock) searchResultsBlock.remove();
          searchResultsBlock = null;
          searchInput.value = '';
        });
        document.body.appendChild(blur);

        searchResultsBlock = document.createElement('div');
        searchResultsBlock.className = 'search-results';
        searchResultsBlock.innerHTML = `
          <p>Поиск</p>
          ${goods.length === 0 ? `<div>Ничего не найдено</div>` : goods.slice(0, 5).map(good => `
            <div class="search-item">${good.title}</div>
          `).join('')}
        `;

        document.body.appendChild(searchResultsBlock);
      });
  });
}

// export function createHeader() {
//   const header = document.createElement('header');
//   header.className = 'site-header';

//   const logo = document.createElement('div');
//   logo.className = 'logo';

//   const logoImg = document.createElement('img');
//   logoImg.src = '/public/img/uzum.png';

//   const logoText = document.createElement('span');
//   logoText.textContent = 'Uzum market';

//   logo.append(logoImg, logoText);

//   const catalog = document.createElement('button');
//   catalog.className = 'catalog-button';
//   catalog.textContent = 'Каталог';

//   let categoriesVisible = false;
//   let categoriesBlock = null;

//   catalog.addEventListener('click', () => {
//     const existingOverlay = document.querySelector('.overlay');
  
//     if (!categoriesVisible) {
//       axios.get('http://localhost:3000/goods')
//         .then(res => {
//           const goods = res.data;
//           const types = [...new Set(goods.map(good => good.type))];
//           const counts = {};
  
//           goods.forEach(g => {
//             counts[g.type] = (counts[g.type] || 0) + 1;
//           });
  
//           createCatalogMenu(types, counts);
//           categoriesVisible = true;
  
//           const overlay = document.createElement('div');
//           overlay.className = 'overlay';
//           overlay.addEventListener('click', () => {
//             categoriesBlock.classList.remove('open');
//             overlay.remove(); 
//             categoriesVisible = false;
//           });
  
//           document.body.appendChild(overlay);
  
//           requestAnimationFrame(() => {
//             categoriesBlock.classList.add('open');
//             overlay.classList.add('active');
//           });
//         })
//         .catch(err => console.error(err));
//     } else {
//       if (categoriesBlock) categoriesBlock.classList.remove('open');
//       if (existingOverlay) existingOverlay.remove();
//       categoriesVisible = false;
//     }
//   });
  

//   const search = document.createElement('div');
//   search.className = 'search';

//   const input = document.createElement('input');
//   input.placeholder = 'Искать товары и категории';

//   const searchIcon = document.createElement('img');
//   searchIcon.src = 'https://cdn-icons-png.flaticon.com/512/622/622669.png';
//   searchIcon.alt = 'Поиск';

//   search.append(input, searchIcon);

//   let searchResultsBlock = null;

//   input.addEventListener('input', () => {
//     const query = input.value.trim().toLowerCase();

//     if (searchResultsBlock) {
//       searchResultsBlock.remove();
//       searchResultsBlock = null;
//     }

//     if (query.length === 0) return;

//     axios.get('http://localhost:3000/goods')
//       .then(res => {
//         const goods = res.data.filter(g => g.title.toLowerCase().includes(query));
//         createSearchResults(goods.slice(0, 5), query); 
//       }); 

//       document.body.appendChild(overlay);
//   });

// function createSearchResults(results, query) {
//   searchResultsBlock = document.createElement('div');
//   searchResultsBlock.className = 'search-results';

//   const blur = document.createElement('div');
//   blur.className = 'blur';
//   blur.addEventListener('click', () => {
//     blur.remove();
//     searchResultsBlock.remove();
//     searchResultsBlock = null;
//     input.value = '';
//   });
  
//   document.body.appendChild(blur);


//   const label = document.createElement('p');
//   label.textContent = 'Поиск';
//   searchResultsBlock.appendChild(label);

//   if (results.length === 0) {
//     const notFound = document.createElement('div');
//     notFound.textContent = 'Ничего не найдено';
//     searchResultsBlock.appendChild(notFound);
//   } else {
//     results.forEach(good => {
//       const item = document.createElement('div');
//       item.className = 'search-item';
//       item.textContent = good.title;
//       searchResultsBlock.appendChild(item);
//     });
//   }

//   document.body.appendChild(searchResultsBlock);
//   }

//   const actions = document.createElement('div');
//   actions.className = 'actions';

//   const icons = [
//     { img: '/img/user.webp', text: 'Войти' },
//     { img: '/img//heart.webp', text: 'Избранное' },
//     { img: '/img/korzina.png', text: 'Корзина' }
//   ];

//   icons.forEach(item => {
//     const icon = document.createElement('a');
//     icon.className = 'icon';
//     icon.href = '#';

//     const img = document.createElement('img');
//     img.src = item.img;

//     const span = document.createElement('span');
//     span.textContent = item.text;

//     icon.append(img, span);
//     actions.appendChild(icon);
//   });

//   header.append(logo, catalog, search, actions);
//   main.appendChild(header);

//   function createCatalogMenu(types, counts) {
//     if (categoriesBlock) categoriesBlock.remove();

//     categoriesBlock = document.createElement('div');
//     categoriesBlock.className = 'catalog-menu';

//     const title = document.createElement('p');
//     title.textContent = 'Категории товаров';
//     title.className = 'catalog-title';
//     categoriesBlock.appendChild(title);

//     types.forEach(type => {
//       const row = document.createElement('div');
//       row.className = 'catalog-item';

//       const title = document.createElement('h3');
//       title.textContent = type;


//       const badge = document.createElement('span');
//       badge.className = 'count-badge';
//       badge.textContent = `${counts[type]} товаров`;

//       row.append(title, badge);
//       categoriesBlock.appendChild(row);
//     });

//     document.body.appendChild(categoriesBlock);
//   }
// }
