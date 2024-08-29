import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSymptomCheckerDto } from './dto/create-symptom-checker.dto';
import { UpdateSymptomCheckerDto } from './dto/update-symptom-checker.dto';
import axios from 'axios';
import { formatResponse } from 'src/common/utils/response.util';

@Injectable()
export class SymptomCheckerService {
  private readonly apiUrl = 'http://api.endlessmedical.com/v1/dx';

  constructor(private readonly prisma: PrismaService) {}

  // Initialize a session and return the SessionID
  private async initSession(): Promise<string> {
    const response = await axios.get(`${this.apiUrl}/InitSession`);
    return response.data.SessionID;
  }

  // Accept the Terms of Use for the session
  private async acceptTermsOfUse(sessionId: string): Promise<void> {
    const passphrase = 'I have read, understood and I accept and agree to comply with the Terms of Use of EndlessMedicalAPI and Endless Medical services. The Terms of Use are available on endlessmedical.com';
    await axios.post(`${this.apiUrl}/AcceptTermsOfUse?SessionID=${sessionId}&passphrase=${encodeURIComponent(passphrase)}`);
  }

  // Update features like Age, Gender, etc.
  private async updateFeature(sessionId: string, name: string, value: any): Promise<void> {
    await axios.post(`${this.apiUrl}/UpdateFeature?SessionID=${sessionId}&name=${encodeURIComponent(name)}&value=${value}`);
  }

  // Analyze symptoms and return diseases with probabilities
  private async analyzeSymptoms(sessionId: string): Promise<any> {
    const response = await axios.get(`${this.apiUrl}/Analyze?SessionID=${sessionId}`);
    return response.data.Diseases;
  }

  async create(createSymptomCheckerDto: CreateSymptomCheckerDto) {
    try {
      const sessionId = await this.initSession();
      console.log('Session initialized:', sessionId);
  
      await this.acceptTermsOfUse(sessionId);
      console.log('Terms of use accepted for session:', sessionId);
  
      // // Updating features
      // const randomAge = Math.floor(Math.random() * (100 - 18 + 1)) + 18;
      // const randomGender = Math.random() < 0.5 ? 2 : 3;
      // await this.updateFeature(sessionId, 'Age', randomAge);
      // await this.updateFeature(sessionId, 'Gender', randomGender);
  
      for (const symptom of createSymptomCheckerDto.symptoms) {
        console.log(`Updating symptom: ${symptom}`);
        await this.updateFeature(sessionId, symptom, 1); // Assuming a default value of 1 for the symptom
      }
  
      // Analyzing symptoms
      console.log('Analyzing symptoms...');
      const diagnosis = await this.analyzeSymptoms(sessionId);
      const diagnosisString = diagnosis.map(d => Object.keys(d)[0]).join(', ');
  
      const result = await this.prisma.symptomChecker.create({
        data: {
          ...createSymptomCheckerDto,
          diagnosis: diagnosisString,
        },
      });
  
      return formatResponse('Symptom checker data processed successfully', result);
    } catch (error) {
      console.error('Error occurred during symptom checker creation:', error.message, error.response?.data);
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
    const { userId, recommendedDoctorId, ...rest } = updateSymptomCheckerDto;

    const updatedSymptomChecker = await this.prisma.symptomChecker.update({
      where: { id },
      data: rest,
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
