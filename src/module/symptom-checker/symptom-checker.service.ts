import { Injectable } from '@nestjs/common';
import { CreateSymptomCheckerDto } from './dto/create-symptom-checker.dto';
import { HttpService } from '@nestjs/axios';
import { config } from '@config';
import OpenAI from 'openai';

@Injectable()
export class SymptomCheckerService {constructor(
  private httpService: HttpService,
) {}

async create({description}: CreateSymptomCheckerDto) {
  const openai = new OpenAI({apiKey: config.openai.apiKey});
  const response = await openai.completions.create({
    model: "gpt-3.5-turbo-instruct",
    prompt: `Patient description: "${description}".\n\nProvide a medical diagnosis:`,
    max_tokens: 150,
  })
  return response
}

  findAll() {
    return `This action returns all symptomChecker`;
  }

  findOne(id: number) {
    return `This action returns a #${id} symptomChecker`;
  }
}
