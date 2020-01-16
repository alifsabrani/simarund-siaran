export default {
	items: [
		{
			name: 'Siaran',
			url: '/siaran',
			icon: 'fa fa-television',
			children: [
				{
					name: 'Siaran Utama',
					url: '/siaran/utama',
					icon: 'fa fa-desktop',
					class: 'pl-4'
				},
				{
					name: 'Program Tambahan',
					url: '/siaran/tambahan',
					icon: 'fa fa-laptop',
					class: 'pl-4'
				}
			]
		},
		{
			name: 'Item',
			url: '/item',
			icon: 'fa fa-newspaper-o',
			children: [
				{
					name: 'Berita',
					url: '/item/berita',
					icon: 'fa fa-video-camera',
					class: 'pl-4'
				},
				{
					name: 'Berita Daerah',
					url: '/item/berita-daerah',
					icon: 'fa fa-film',
					class: 'pl-4'
				},
				{
					name: 'Lainnya',
					url: '/item/lainnya',
					icon: 'fa fa-ellipsis-h',
					class: 'pl-4'
				}
			]
		},
		{
			name: 'Kategori Program',
			url: '/kategori-program',
			icon: 'fa fa-tags'
		},
		{
			name: 'Pegawai',
			url: '/pegawai',
			icon: 'fa fa-group'
		},
		{
			name: 'Pengguna',
			url: '/pengguna',
			icon: 'fa fa-user'
		},
		{
			name: 'Jadwal',
			url: '/jadwal',
			icon: 'fa fa-calendar'
		}
	]
};
