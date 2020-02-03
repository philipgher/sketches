class GeneticAlgorithm {
  constructor(config) {
    console.log(config);
    this.mutationFunction = config.mutationFunction;
    this.crossoverFunction = config.crossoverFunction;
    this.fitnessFunction = config.fitnessFunction;
    this.population = config.population;
    this.populationSize = config.populationSize;
  }

  _populate(firstSample, size) {
    return [...Array(size)].map(() => this.mutateFunction(firstSample));
  }

  evolve() {

  }

  best() {

  }
}

export default GeneticAlgorithm;
