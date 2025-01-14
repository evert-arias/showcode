import hexAlpha from 'hex-alpha';
import { defaults } from 'lodash';
import { useContext } from '@nuxtjs/composition-api';

export default function () {
    const { $shiki } = useContext();

    const findEditorLanguageById = (languages, id) =>
        languages.find((lang) => lang.id === id)?.name;

    const buildCodeBlocks = async (config, callback) => {
        const { code, languages, opacity, theme } = defaults(config, {
            code: [],
            languages: [],
            opacity: 100,
            theme: 'github-light',
        });

        await $shiki.loadLanguages(languages.map((lang) => lang.name));

        await $shiki.loadTheme(theme);

        const blocks = await Promise.all(
            code.map(
                async (code) =>
                    await $shiki.tokens(
                        code.value,
                        findEditorLanguageById(languages, code.id),
                        theme
                    )
            )
        );

        const { name, fg, bg, type } = $shiki.getTheme(theme);

        callback({
            blocks: blocks,
            themeType: name.includes('light') ? 'light' : type,
            themeForeground: hexAlpha(fg, parseFloat(opacity)),
            themeBackground: hexAlpha(bg, parseFloat(opacity)),
        });
    };

    return { buildCodeBlocks };
}
