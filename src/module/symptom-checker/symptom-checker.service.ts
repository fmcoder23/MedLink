import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSymptomCheckerDto } from './dto/create-symptom-checker.dto';
import { UpdateSymptomCheckerDto } from './dto/update-symptom-checker.dto';
import OpenAIApi from 'openai'; // Assuming `OpenAIApi` is the default export
import { formatResponse } from 'src/common/utils/response.util';

@Injectable()
export class SymptomCheckerService {
  private openai: OpenAIApi;

  constructor(private readonly prisma: PrismaService) {
    this.openai = new OpenAIApi({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async analyzeSymptoms(symptoms: string[]): Promise<string> {
    try {
      const prompt = `Based on the following symptoms: ${symptoms.join(', ')}, what are the potential diagnoses?`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',  // Use a supported model
        messages: [
          { role: 'system', content: 'You are a helpful medical assistant.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      const diagnosis = response.choices[0].message.content.trim();
      return diagnosis;
    } catch (error) {
      console.error('Error with OpenAI API:', error);
      throw new HttpException('OpenAI API Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(createSymptomCheckerDto: CreateSymptomCheckerDto) {
    try {
      const diagnosis = await this.analyzeSymptoms(createSymptomCheckerDto.symptoms);

      const result = await this.prisma.symptomChecker.create({
        data: {
          ...createSymptomCheckerDto,
          diagnosis,
        },
      });

      return formatResponse('Symptom checker data processed successfully', result);
    } catch (error) {
      console.error('Error occurred during symptom checker creation:', error.message);
      throw error;
    }
  }

  async findAll() {
    const results = await this.prisma.symptomChecker.findMany();
    return formatResponse('Symptom checkers retrieved successfully', results);
  }

  async findOne(id: string) {
    const symptomChecker = await this.prisma.symptomChecker.findUnique({
      where: { id },
    });
    if (!symptomChecker) {
      throw new NotFoundException(`SymptomChecker with ID ${id} not found`);
    }
    return formatResponse(`SymptomChecker with ID ${id} retrieved successfully`, symptomChecker);
  }

  async update(id: string, updateSymptomCheckerDto: UpdateSymptomCheckerDto) {
    const updatedSymptomChecker = await this.prisma.symptomChecker.update({
      where: { id },
      data: updateSymptomCheckerDto,
    });

    return formatResponse(`SymptomChecker with ID ${id} updated successfully`, updatedSymptomChecker);
  }

  async remove(id: string) {
    const deletedSymptomChecker = await this.prisma.symptomChecker.delete({
      where: { id },
    });
    return formatResponse(`SymptomChecker with ID ${id} deleted successfully`, deletedSymptomChecker);
  }
}
