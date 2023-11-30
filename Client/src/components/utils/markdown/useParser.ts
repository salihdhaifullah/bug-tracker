import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import { useEffect, useState } from 'react';

import dark from "highlight.js/styles/atom-one-dark.css?inline";
import light from 'highlight.js/styles/atom-one-light.css?inline';
import { useTheme } from '../../../utils/context/theme';

export default function useParser(md: string): string {
    const theme = useTheme();

    useEffect(() => {
        const css = theme === "dark" ? dark : light;

        const styleElement = document.createElement('style');
        styleElement.textContent = css;
        document.head.appendChild(styleElement);

        return () => {
            document.head.removeChild(styleElement);
        };
    }, [theme])

    const [html, setHtml] = useState("");

    useEffect(() => {
        setHtml(parser.render(md))
    }, [md])

    const parser: MarkdownIt = new MarkdownIt({
        highlight: (str, lang) => {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return '<pre class="hljs"><code>' +
                        hljs.highlight(str, { language: lang }).value +
                        '</code></pre>';
                } catch (err) { }
            }

            return '<pre class="hljs"><code>' + parser.utils.escapeHtml(str) + '</code></pre>';
        }
    })

    return html;
}


