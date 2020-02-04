/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */

class GeneticAlgorithm {
  constructor(config) {
    this.logFittest = !!config.logFittest;
    console.log(this.logFittest);


    this.mutationFunction = config.mutationFunction;
    this.crossoverFunction = config.crossoverFunction;
    this.fitnessFunction = config.fitnessFunction;
    this.populationSize = config.populationSize;

    this.population = this._populate(config.firstIndividual, config.populationSize);
  }

  _populate(parent, size) {
    return [...Array(size)].map(() => this.mutationFunction(parent));
  }

  _calculateFitnesses() {
    const fitnesses = this.population.map((individual, i) => ({ score: this.fitnessFunction(individual), i }));

    return fitnesses.sort((cur, prev) => cur.score - prev.score);
  }

  evolve() {
    // first calculate all fitness scores for the current population
    const fitnesses = this._calculateFitnesses();

    // regenerate population from offspring of fittest individuals
    const newPopulation = [...Array(10)].map((_, i) => this.population[fitnesses[i].i]);

    let step = 0;
    while (newPopulation.length < this.populationSize) {
      newPopulation.push(this.mutationFunction(newPopulation[step % 20]));
      step += 1;
    }

    this.population = newPopulation;
  }

  best() {
    const fits = this._calculateFitnesses();

    if (this.logFittest === true) {
      console.log('fittest value:', fits[0].score);
    }

    return this.population[fits[0].i];
  }
}

export default GeneticAlgorithm;
