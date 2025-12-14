-- ===========================================
-- BARTENDER - Schema Supabase
-- ===========================================
-- A executer dans le SQL Editor de Supabase Dashboard
-- https://supabase.com/dashboard/project/[your-project]/sql

-- Table cocktails
CREATE TABLE IF NOT EXISTS cocktails (
   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
   name VARCHAR(255) NOT NULL,
   instructions TEXT NOT NULL,
   ingredients JSONB NOT NULL DEFAULT '[]',
   category VARCHAR(50) DEFAULT 'autres',
   image_url TEXT,
   is_public BOOLEAN DEFAULT false,
   created_at TIMESTAMPTZ DEFAULT NOW(),
   updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_cocktails_user_id ON cocktails(user_id);
CREATE INDEX IF NOT EXISTS idx_cocktails_category ON cocktails(category);
CREATE INDEX IF NOT EXISTS idx_cocktails_is_public ON cocktails(is_public);

-- Table favorites
CREATE TABLE IF NOT EXISTS favorites (
   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
   cocktail_id UUID REFERENCES cocktails(id) ON DELETE CASCADE,
   api_cocktail_name VARCHAR(255),
   api_cocktail_data JSONB,
   source VARCHAR(10) NOT NULL CHECK (source IN ('db', 'api')),
   created_at TIMESTAMPTZ DEFAULT NOW(),

   -- Contraintes
   CONSTRAINT favorite_source_check CHECK (
      (source = 'db' AND cocktail_id IS NOT NULL AND api_cocktail_name IS NULL) OR
      (source = 'api' AND cocktail_id IS NULL AND api_cocktail_name IS NOT NULL)
   ),
   CONSTRAINT unique_db_favorite UNIQUE (user_id, cocktail_id),
   CONSTRAINT unique_api_favorite UNIQUE (user_id, api_cocktail_name)
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);

-- ===========================================
-- Row Level Security (RLS)
-- ===========================================

-- Activer RLS
ALTER TABLE cocktails ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Policies cocktails
CREATE POLICY "Users can view own cocktails" ON cocktails
   FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public cocktails" ON cocktails
   FOR SELECT USING (is_public = true);

CREATE POLICY "Users can insert own cocktails" ON cocktails
   FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cocktails" ON cocktails
   FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cocktails" ON cocktails
   FOR DELETE USING (auth.uid() = user_id);

-- Policies favorites
CREATE POLICY "Users can view own favorites" ON favorites
   FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON favorites
   FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON favorites
   FOR DELETE USING (auth.uid() = user_id);

-- ===========================================
-- Donnees de demo (optionnel)
-- ===========================================
-- Decommenter pour ajouter des cocktails de demo

/*
-- Note: Remplacer 'YOUR_USER_ID' par un vrai user_id apres inscription

INSERT INTO cocktails (user_id, name, instructions, ingredients, category, is_public) VALUES
(
   'YOUR_USER_ID',
   'Mojito',
   'Ecraser les feuilles de menthe avec le sucre. Ajouter le jus de citron vert. Verser le rhum et completer avec de l''eau gazeuse. Melanger delicatement.',
   '[{"name": "Rhum blanc", "amount": "5cl"}, {"name": "Jus de citron vert", "amount": "3cl"}, {"name": "Sucre de canne", "amount": "2 cuilleres"}, {"name": "Feuilles de menthe", "amount": "10"}, {"name": "Eau gazeuse", "amount": "Top"}]',
   'classiques',
   true
),
(
   'YOUR_USER_ID',
   'Margarita',
   'Givrer le bord du verre avec du sel. Shaker tous les ingredients avec de la glace. Filtrer dans le verre.',
   '[{"name": "Tequila", "amount": "5cl"}, {"name": "Triple sec", "amount": "2cl"}, {"name": "Jus de citron vert", "amount": "2cl"}]',
   'classiques',
   true
),
(
   'YOUR_USER_ID',
   'Pina Colada',
   'Mixer tous les ingredients avec de la glace pillee. Servir dans un verre hurricane. Decorer avec une tranche d''ananas.',
   '[{"name": "Rhum blanc", "amount": "4cl"}, {"name": "Creme de coco", "amount": "4cl"}, {"name": "Jus d ananas", "amount": "8cl"}]',
   'tiki',
   true
);
*/
