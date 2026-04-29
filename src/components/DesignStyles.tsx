import { createClient } from '@/lib/supabase/server'
import { buildDesignCss, type DesignConfig } from '@/lib/design/config'

function sanitizeCss(css: string): string {
  return css.replace(/<[^>]*>/g, '')
}

export async function DesignStyles() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_config')
      .select('value')
      .eq('key', 'design')
      .single()

    if (error || !data?.value) return null

    const config = data.value as DesignConfig
    const css = sanitizeCss(buildDesignCss(config))

    return (
      <style
        // Values come from PALETTE_VARS / FONT_*_VARS — server-side constants, never raw user input
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: css }}
      />
    )
  } catch {
    return null
  }
}
