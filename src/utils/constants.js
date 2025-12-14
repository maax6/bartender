export const CATEGORIES = {
   CLASSIQUES: 'classiques',
   SHOTS: 'shots',
   SIGNATURES: 'signatures',
   TIKI: 'tiki',
   SANS_ALCOOL: 'sans-alcool',
   AUTRES: 'autres',
}

export const CATEGORY_OPTIONS = [
   { value: 'classiques', label: 'Classiques' },
   { value: 'shots', label: 'Shots' },
   { value: 'signatures', label: 'Signatures' },
   { value: 'tiki', label: 'Tiki' },
   { value: 'sans-alcool', label: 'Sans Alcool' },
   { value: 'autres', label: 'Autres' },
]

export const CATEGORY_COLORS = {
   classiques: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
   shots: 'bg-red-500/20 text-red-400 border-red-500/30',
   signatures: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
   tiki: 'bg-green-500/20 text-green-400 border-green-500/30',
   'sans-alcool': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
   autres: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}
