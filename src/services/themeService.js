const ThemeService = {
    getPrimaryColor: (theme, opacity=-1) => {
        const color = theme.palette.primary.main;
        if(opacity > -1) return ThemeService.hexToRgba(color, opacity);
        return color;
    },
    hexToRgba: (value, opacity) => {
        let hex = value.replace('#', '');
        if (hex.length === 3) {
            hex = hex.split('').map(function (hex) {
                return hex + hex;
            }).join('');
        }
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r},${g},${b},${opacity})`;
    }
}

export default ThemeService;