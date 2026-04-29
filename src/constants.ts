/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface QuizQuestion {
  q: string;
  a: string[];
  c: number;
  e: string;
}

export const QUIZ_DATA: QuizQuestion[] = [
  { 
    q: "¿Cómo se define formalmente la derivada de una función f(x) en un punto?", 
    a: ["Como el límite del cociente de diferencias cuando h tiende a cero", "Como la multiplicación de la función por su exponente", "Como el valor de la función cuando x es igual a cero", "Como el área encerrada bajo la curva de la función"], 
    c: 0, 
    e: "La definición formal es f'(x) = lim h→0 [f(x+h) - f(x)] / h, que representa la razón de cambio instantánea." 
  },
  { 
    q: "¿Cuál es la interpretación geométrica de la derivada?", 
    a: ["El área bajo la curva", "La pendiente de la recta tangente", "La longitud de un arco", "Un punto en el eje x"], 
    c: 1, 
    e: "La derivada f'(x) representa exactamente la pendiente de la recta tangente en el punto x." 
  },
  { 
    q: "¿Qué sucede con la recta secante cuando el punto Q se acerca a P?", 
    a: ["Desaparece", "Se vuelve vertical", "Se convierte en la recta tangente", "Se vuelve una curva"], 
    c: 2, 
    e: "La tangente es el límite de la recta secante cuando el incremento h tiende a cero." 
  },
  { 
    q: "En física, la derivada de la posición con respecto al tiempo es:", 
    a: ["La masa", "La velocidad instantánea", "La aceleración constante", "La gravedad"], 
    c: 1, 
    e: "La razón de cambio de la posición es la definición física de velocidad." 
  },
  { 
    q: "¿Qué matemático introdujo la notación dy/dx?", 
    a: ["Newton", "Galileo", "Leibniz", "Kepler"], 
    c: 2, 
    e: "Gottfried Leibniz introdujo esta notación pensando en el cociente de diferencias infinitesimales." 
  },
  { 
    q: "¿Qué afirma el Teorema sobre derivabilidad y continuidad?", 
    a: ["Derivabilidad implica continuidad", "Toda función es derivable", "La derivada es siempre positiva", "Continuidad implica derivabilidad"], 
    c: 0, 
    e: "Si una función es derivable en un punto, necesariamente es continua en ese punto." 
  },
  { 
    q: "¿Cuál es la derivada de una función constante f(x) = k?", 
    a: ["k", "1", "0", "x"], 
    c: 2, 
    e: "Una constante no cambia, por lo que su razón de cambio (derivada) es siempre cero." 
  },
  { 
    q: "¿Qué ocurre en un punto donde la gráfica tiene una 'esquina'?", 
    a: ["La derivada es cero", "La función no es derivable allí", "La tangente es horizontal", "La derivada es infinita"], 
    c: 1, 
    e: "En las puntas o esquinas, no hay una única tangente, por lo que la derivada no existe." 
  },
  { 
    q: "¿Cómo se llama el proceso de determinar una derivada?", 
    a: ["Integración", "Límites", "Derivación", "Sustitución"], 
    c: 2, 
    e: "El cálculo de la derivada se denomina derivación o diferenciación." 
  },
  { 
    q: "Según la regla de la potencia, ¿cuál es la derivada de x^n?", 
    a: ["x^(n-1)", "n * x^(n-1)", "n * x", "x^n / n"], 
    c: 1, 
    e: "Se baja el exponente como coeficiente y se resta uno al grado de la potencia." 
  }
];

export const FUN_FACTS = [
  "Arquímedes ya usaba métodos similares al cálculo 2000 años antes de Newton.",
  "Newton llamó a su versión del cálculo 'método de fluxiones'.",
  "La derivada permite optimizar trayectorias espaciales minimizando el combustible.",
  "Gottfried Leibniz y Isaac Newton inventaron el cálculo de forma independiente.",
  "Sin la derivada, no podríamos calcular con precisión la aceleración de un coche en tiempo real."
];
